import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { verifyCbxId, verifyFideId } from '@/app/torneios-abertos/[torneio]/form/verify-player'

/**
 * Recorte fiel do que a busca da FIDE devolve (endereço que a página
 * index.phtml?search=<id> chama por AJAX), com os mesmos `data-label`, a mesma
 * tabela `#table_results` e as mesmas colunas.
 */
const paginaDeBusca = (linha: {
    id: string
    nome: string
    titulo?: string
    federacao?: string
    standard?: string
    rapid?: string
    blitz?: string
    nascimento?: string
}) => `
<div id="tabs" class="ui-tabs ui-corner-all ui-widget ui-widget-content"><div>
    &nbsp;&nbsp;&nbsp;1 record(s) found.
</div><ul role="tablist" class="ui-tabs-nav"><li role="tab" class="ui-tabs-tab"><a href="#tabs-1">1</a></li></ul>
<div id="tabs-1" role="tabpanel" class="ui-tabs-panel">
<table cellpadding=1 cellspacing=2 border=0 width=100% align=center class="table-top" id="table_results">
    <thead>
    <tr>
    <th class="box-div"><b>FIDE ID</b></th>
    <th><b>Name</b></th>
    <th><b>Title</b></th>
    <th><b>Tr.T.</b></th>
    <th><b>Fed</b></th>
    <th><b>Std.</b></th>
    <th><b>Rpd.</b></th>
    <th><b>Blz.</b></th>
    <th><b>B-Year</b></th>
    </tr>
    </thead>
    <tbody><tr>
        <td data-label="FIDEID" class="box-div">${linha.id}</td>
        <td data-label="Name"><a href=/profile/${linha.id} class="found_name">${linha.nome}</a></td>
        <td data-label="title">${linha.titulo ?? ' '}</td>
        <td data-label="Train. Ttl."><span style="color:#c49191"></span></td>
        <td class="flag-wrapper">
                        <img src="/svg/${linha.federacao ?? 'BRA'}.svg" alt="${linha.federacao ?? 'BRA'}">${linha.federacao ?? 'BRA'}
                        </td>
        <td data-label="Rtg">${linha.standard ?? ''}</td>
        <td data-label="Rtg">${linha.rapid ?? ''}</td>
        <td data-label="Rtg">${linha.blitz ?? ''}</td>
        <td data-label="B-Year">${linha.nascimento ?? ''}</td>
        </tr></tbody></table></div></div>`

const paginaDoJogador = paginaDeBusca({
    id: '44731736',
    nome: 'Fischborn, Henrique Da Rosa',
    rapid: '1560',
    blitz: '1596',
    nascimento: '2009',
})

const paginaDeBloqueio = '<html><body><h1>Access denied</h1></body></html>'
const paginaSemJogador =
    '<br><br>&nbsp;&nbsp;&nbsp;No results found for your query. Please modify search parameters.<br><br>'

const resposta = (html: string, status = 200) =>
    ({ ok: status >= 200 && status < 300, status, text: async () => html }) as Response

const fetchMock = vi.fn()

beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    // As falhas são registradas de propósito no servidor; o teste não precisa do ruído.
    vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('verifyFideId', () => {
    it('extrai os dados da busca', async () => {
        fetchMock.mockResolvedValueOnce(resposta(paginaDoJogador))

        const resultado = await verifyFideId('44731736')

        expect(resultado).toEqual({
            status: 'found',
            player: {
                name: 'Fischborn, Henrique Da Rosa',
                bornYear: '2009',
                // A busca não informa gênero: sem título feminino, fica nulo.
                genre: null,
                title: null,
                federation: 'BRA',
                idFide: '44731736',
                ratings: { standard: null, rapid: 1560, blitz: 1596 },
            },
        })
    })

    it('consulta a busca da FIDE com cabeçalhos de navegador', async () => {
        fetchMock.mockResolvedValueOnce(resposta(paginaDoJogador))

        await verifyFideId('44731736')

        const [url, opcoes] = fetchMock.mock.calls[0]
        expect(url).toBe('https://ratings.fide.com/incl_search_l.php?search=44731736&simple=1')
        expect(opcoes.headers.Referer).toBe('https://ratings.fide.com/index.phtml?search=44731736')
        // Sem este cabeçalho a FIDE responde 200 com corpo vazio.
        expect(opcoes.headers['X-Requested-With']).toBe('XMLHttpRequest')
        expect(opcoes.signal).toBeDefined()
    })

    /**
     * O rating gravado tem de ser o da classe de tempo do torneio, então os três
     * precisam sair na coluna certa: Std. → standard, Rpd. → rapid, Blz. → blitz.
     */
    it('não troca standard, rapid e blitz de coluna', async () => {
        fetchMock.mockResolvedValueOnce(
            resposta(
                paginaDeBusca({
                    id: '2107660',
                    nome: 'Mekhitarian, Krikor Sevag',
                    titulo: 'GM',
                    standard: '2543',
                    rapid: '2576',
                    blitz: '2568',
                    nascimento: '1986',
                })
            )
        )

        const resultado = await verifyFideId('2107660')

        expect(resultado).toMatchObject({
            status: 'found',
            player: {
                title: 'gm',
                ratings: { standard: 2543, rapid: 2576, blitz: 2568 },
            },
        })
    })

    it('trata "no results found" como jogador inexistente', async () => {
        fetchMock.mockResolvedValueOnce(resposta(paginaSemJogador))

        await expect(verifyFideId('9999999')).resolves.toEqual({ status: 'not-found' })
    })

    it('não confunde outro jogador da lista com o ID consultado', async () => {
        fetchMock.mockResolvedValueOnce(resposta(paginaDoJogador))

        await expect(verifyFideId('1234567')).resolves.toEqual({ status: 'not-found' })
    })

    it('devolve indisponível quando a FIDE responde sem a tabela', async () => {
        fetchMock.mockResolvedValue(resposta(paginaDeBloqueio))

        const resultado = await verifyFideId('44731736')

        expect(resultado.status).toBe('unavailable')
        expect(resultado).toMatchObject({ motivo: 'página inesperada da FIDE' })
    })

    it('trata corpo vazio como falha em vez de "não encontrado"', async () => {
        // É o que a FIDE devolve quando recusa a requisição sem dizer que recusou.
        fetchMock.mockResolvedValue(resposta(''))

        const resultado = await verifyFideId('44731736')

        expect(resultado).toEqual({ status: 'unavailable', motivo: 'resposta vazia' })
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('tenta de novo e funciona quando a primeira requisição falha', async () => {
        fetchMock
            .mockResolvedValueOnce(resposta('', 503))
            .mockResolvedValueOnce(resposta(paginaDoJogador))

        await expect(verifyFideId('44731736')).resolves.toMatchObject({ status: 'found' })
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('devolve o motivo da falha quando todas as tentativas falham', async () => {
        fetchMock.mockResolvedValue(resposta('', 503))

        const resultado = await verifyFideId('44731736')

        expect(resultado).toEqual({ status: 'unavailable', motivo: 'HTTP 503' })
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('não repete quando o site não responde (conexão descartada)', async () => {
        // É o caso da FIDE com IP de datacenter: a conexão fica pendurada. Repetir
        // dobraria a espera do jogador sem chance de dar certo.
        fetchMock.mockImplementation(
            (_url: string, opcoes: { signal: AbortSignal }) =>
                new Promise((_resolve, reject) => {
                    opcoes.signal.addEventListener('abort', () => {
                        const erro = new Error('The operation was aborted due to timeout')
                        erro.name = 'TimeoutError'
                        reject(erro)
                    })
                })
        )

        const resultado = await verifyFideId('44731736', { prazoMs: 1500 })

        expect(resultado).toEqual({ status: 'unavailable', motivo: 'tempo esgotado' })
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('resume o erro de rede em vez de deixar o formulário sem explicação', async () => {
        fetchMock.mockRejectedValue(new Error('getaddrinfo ENOTFOUND ratings.fide.com'))

        const resultado = await verifyFideId('44731736')

        expect(resultado.status).toBe('unavailable')
        expect(resultado).toMatchObject({ motivo: 'getaddrinfo ENOTFOUND ratings.fide.com' })
    })

    /** A busca já traz o título abreviado; o perfil trazia por extenso. */
    const paginaComTitulo = (titulo: string) =>
        paginaDeBusca({ id: '2114852', nome: 'Nunes, Agatha Hurba', titulo, standard: '1899', rapid: '1935', blitz: '1941', nascimento: '1999' })

    it.each([
        ['WFM WFM', 'wfm', 'f'],
        ['WGM', 'wgm', 'f'],
        ['WIM', 'wim', 'f'],
        ['WCM', 'wcm', 'f'],
        ['GM', 'gm', null],
        ['IM', 'im', null],
        ['FM', 'fm', null],
        ['CM', 'cm', null],
        ['GM WGM', 'gm', 'f'],
        [' ', null, null],
    ])('lê o título "%s" como %s', async (abreviacao, esperado, genero) => {
        fetchMock.mockResolvedValueOnce(resposta(paginaComTitulo(abreviacao)))

        const resultado = await verifyFideId('2114852')

        expect(resultado).toMatchObject({
            status: 'found',
            player: { title: esperado, genre: genero },
        })
    })

    it('continua entendendo o título por extenso', async () => {
        fetchMock.mockResolvedValueOnce(resposta(paginaComTitulo('Woman FIDE Master')))

        const resultado = await verifyFideId('2114852')

        expect(resultado).toMatchObject({ status: 'found', player: { title: 'wfm', genre: 'f' } })
    })
})

describe('verifyFideId com proxy de saída', () => {
    // A FIDE não atende IP de nuvem; FIDE_PROXY desvia só a consulta dela.
    const comProxy = (template: string, teste: () => Promise<void>) => async () => {
        process.env.FIDE_PROXY = template

        try {
            await teste()
        } finally {
            delete process.env.FIDE_PROXY
        }
    }

    const buscaCodificada =
        'https%3A%2F%2Fratings.fide.com%2Fincl_search_l.php%3Fsearch%3D44731736%26simple%3D1'

    it('passa a consulta pelo template quando FIDE_PROXY está definido', comProxy(
        'https://proxy.exemplo/raw?url={url}',
        async () => {
            fetchMock.mockResolvedValueOnce(resposta(paginaDoJogador))

            await expect(verifyFideId('44731736')).resolves.toMatchObject({ status: 'found' })

            const [url] = fetchMock.mock.calls[0]
            expect(url).toBe(`https://proxy.exemplo/raw?url=${buscaCodificada}`)
        }
    ))

    it('anexa o endereço quando o template não tem {url}', comProxy(
        'https://proxy.exemplo/fetch?url=',
        async () => {
            fetchMock.mockResolvedValueOnce(resposta(paginaDoJogador))

            await verifyFideId('44731736')

            const [url] = fetchMock.mock.calls[0]
            expect(url).toBe(`https://proxy.exemplo/fetch?url=${buscaCodificada}`)
        }
    ))

    it('não vaza a chave do proxy no log da Vercel', comProxy(
        'https://api.scraperapi.com/?api_key=SEGREDO&url={url}',
        async () => {
            fetchMock.mockResolvedValue(resposta('', 503))

            await verifyFideId('44731736')

            const registrado = vi
                .mocked(console.error)
                .mock.calls.map((chamada) => chamada.join(' '))
                .join('\n')

            expect(registrado).toContain('api.scraperapi.com')
            expect(registrado).not.toContain('SEGREDO')
        }
    ))

    it('mantém a consulta direta quando a variável não existe', async () => {
        fetchMock.mockResolvedValueOnce(resposta(paginaDoJogador))

        await verifyFideId('44731736')

        expect(fetchMock.mock.calls[0][0]).toBe(
            'https://ratings.fide.com/incl_search_l.php?search=44731736&simple=1'
        )
    })

    it('não desvia a consulta da CBX, que responde normalmente', comProxy(
        'https://proxy.exemplo/raw?url={url}',
        async () => {
            fetchMock.mockResolvedValueOnce(resposta('<html><body></body></html>'))

            await verifyCbxId('76967')

            expect(fetchMock.mock.calls[0][0]).toBe('https://www.cbx.org.br/jogador/76967')
        }
    ))
})

describe('verifyCbxId', () => {
    const paginaCbx = `
    <html><body>
      <div id="dados-jogador-row1">Henrique da Rosa Fischborn Data Nasc.: 23/05/2009 ID FIDE: 44731736</div>
      <table id="ContentPlaceHolder1_gdvRating"><tr><td>Mai/2026</td><td>1786</td><td>1790</td><td>1751</td></tr></table>
    </body></html>`

    it('extrai os dados do perfil', async () => {
        fetchMock.mockResolvedValueOnce(resposta(paginaCbx))

        await expect(verifyCbxId('76967')).resolves.toEqual({
            status: 'found',
            player: {
                name: 'Henrique da Rosa Fischborn',
                bornYear: '23/05/2009',
                genre: null,
                title: null,
                federation: null,
                idFide: '44731736',
                ratings: { standard: 1786, rapid: 1790, blitz: 1751 },
            },
        })
    })

    it('devolve o motivo quando a CBX está fora do ar', async () => {
        fetchMock.mockResolvedValue(resposta('', 502))

        await expect(verifyCbxId('76967')).resolves.toEqual({ status: 'unavailable', motivo: 'HTTP 502' })
    })
})
