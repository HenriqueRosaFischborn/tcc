'use server'

import * as cheerio from 'cheerio'
import countries from 'i18n-iso-countries'
import en from 'i18n-iso-countries/langs/en.json'
import type { LookupResult, OfficialPlayer } from './types'

countries.registerLocale(en)

/**
 * Orçamento total de UMA consulta, somando todas as tentativas.
 *
 * A FIDE não responde requisição vinda de IP de datacenter (é o caso da Vercel):
 * a conexão fica pendurada em vez de ser recusada. Com 2 tentativas de 12 s o
 * jogador passava 24,5 s olhando um formulário parado, sem nenhum aviso, antes
 * de o erro aparecer — que é exatamente o "fica só carregando" relatado.
 *
 * Quem resolve isso é o `FIDE_PROXY` (veja abaixo): o prazo continua curto para
 * o caso sem proxy, em que a FIDE simplesmente não vai responder.
 */
const PRAZO_TOTAL_MS = 8000

/** Teto de cada tentativa isolada, sempre limitado ao que resta do orçamento. */
const PRAZO_POR_TENTATIVA_MS = 6000

const TENTATIVAS = 2
const INTERVALO_ENTRE_TENTATIVAS_MS = 400

/** Abaixo disso não vale começar outra tentativa: ela já nasceria sem tempo. */
const TEMPO_MINIMO_TENTATIVA_MS = 1200

const MOTIVO_TEMPO_ESGOTADO = 'tempo esgotado'

const MOTIVO_RESPOSTA_VAZIA = 'resposta vazia'

// Os sites oficiais recusam requisições com cara de robô (ex.: "Mozilla/5.0" sozinho).
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
  // Sem o Referer a FIDE às vezes responde com a página de bloqueio.
  Referer: 'https://ratings.fide.com/',
}

/**
 * Cabeçalhos da busca da FIDE.
 *
 * `X-Requested-With` não é enfeite: é o que a própria página manda no AJAX que
 * preenche a tabela. Sem ele o servidor responde **200 com corpo vazio** — e um
 * corpo vazio é indistinguível de bloqueio, então a consulta falharia sem
 * explicação.
 */
const cabecalhosDaBuscaFide = (id: string) => ({
  ...BROWSER_HEADERS,
  Referer: `https://ratings.fide.com/index.phtml?search=${encodeURIComponent(id)}`,
  'X-Requested-With': 'XMLHttpRequest',
})

/**
 * A FIDE recusa (ou deixa pendurada) a conexão de IP de nuvem — é o caso da
 * Vercel, e é por isso que a consulta funciona no localhost e falha hospedada.
 * Nenhuma biblioteca HTTP resolve isso: o que decide é o IP de origem.
 *
 * `FIDE_PROXY` desvia SÓ a consulta da FIDE por um endereço que a FIDE aceita
 * (API de scraping, proxy próprio, gateway). É um template com `{url}` no lugar
 * do perfil:
 *
 *   FIDE_PROXY="https://api.scraperapi.com/?api_key=...&url={url}"
 *
 * Sem a variável — localhost, por exemplo — a consulta continua indo direto.
 */
const aplicarProxyFide = (url: string): string => {
  const proxy = process.env.FIDE_PROXY?.trim()

  if (!proxy) return url

  // Serviços que não usam template recebem o endereço anexado ao final, que é o
  // formato ".../raw?url=" adotado por boa parte deles.
  return proxy.includes('{url}')
    ? proxy.replace('{url}', encodeURIComponent(url))
    : proxy + encodeURIComponent(url)
}

/**
 * O log da Vercel é público para quem tem acesso ao projeto, e o endereço do
 * proxy carrega a chave da API na query. Só o endereço sem query vai para lá.
 */
const urlParaLog = (url: string): string => {
  try {
    const { origin, pathname } = new URL(url)
    return origin + pathname
  } catch {
    return 'endereço inválido'
  }
}

/**
 * Resultado de uma tentativa de consulta.
 * `motivo` existe para o erro chegar até o jogador (e até o log da Vercel) em
 * vez de virar um "não foi possível consultar" sem explicação.
 */
type FetchResult = { ok: true; html: string } | { ok: false; motivo: string }

const descreverErro = (error: unknown): string => {
  if (!(error instanceof Error)) return String(error)

  // Timeout do AbortSignal chega como TimeoutError/DOMException.
  if (error.name === 'TimeoutError' || error.name === 'AbortError') return MOTIVO_TEMPO_ESGOTADO

  return error.message === '' ? error.name : error.message
}

async function tentarFetch(
  url: string,
  prazoMs: number,
  headers: Record<string, string> = BROWSER_HEADERS
): Promise<FetchResult> {
  try {
    const response = await fetch(url, {
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(prazoMs),
    })

    if (!response.ok) return { ok: false, motivo: `HTTP ${response.status}` }

    const html = await response.text()

    // Corpo vazio com status 200 não é resposta: é o que os sites oficiais
    // devolvem quando recusam a requisição sem dizer que recusaram.
    if (html.trim() === '') return { ok: false, motivo: MOTIVO_RESPOSTA_VAZIA }

    return { ok: true, html }
  } catch (error) {
    return { ok: false, motivo: descreverErro(error) }
  }
}

/**
 * Vale a pena repetir? Um site que aceitou a conexão e devolveu erro pode
 * responder bem na segunda. Um que estourou o prazo (IP bloqueado, conexão
 * descartada no meio do caminho) não vai responder na segunda — repetir só
 * dobraria a espera do jogador.
 */
const valeRepetir = (motivo: string) => motivo !== MOTIVO_TEMPO_ESGOTADO

/**
 * Baixa a página dentro de um orçamento de tempo fixo. O log fica no servidor
 * porque é lá que a falha acontece quando o sistema está hospedado — sem ele,
 * uma recusa da FIDE é indistinguível de um problema de rede.
 */
async function fetchHtml(
  url: string,
  prazoTotalMs: number,
  headers: Record<string, string> = BROWSER_HEADERS
): Promise<FetchResult> {
  const limite = Date.now() + prazoTotalMs
  let ultimo: FetchResult = { ok: false, motivo: MOTIVO_TEMPO_ESGOTADO }

  for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa++) {
    const restante = limite - Date.now()

    if (restante < TEMPO_MINIMO_TENTATIVA_MS) break

    ultimo = await tentarFetch(url, Math.min(PRAZO_POR_TENTATIVA_MS, restante), headers)

    if (ultimo.ok) return ultimo

    console.error(
      `[consulta-oficial] tentativa ${tentativa}/${TENTATIVAS} falhou em ${urlParaLog(url)}: ${ultimo.motivo}`
    )

    if (tentativa === TENTATIVAS || !valeRepetir(ultimo.motivo)) break

    await new Promise((resolve) => setTimeout(resolve, INTERVALO_ENTRE_TENTATIVAS_MS))
  }

  return ultimo
}

const toRating = (value: string | undefined): number | null => {
  const rating = Number(value)
  return Number.isFinite(rating) && rating > 0 ? rating : null
}

/**
 * A FIDE escreve o título por extenso no perfil ("Woman FIDE Master") e
 * abreviado na busca ("WFM", "GM WGM"). O sistema guarda a abreviação oficial,
 * então as duas formas são traduzidas aqui.
 */
const TITULOS_POR_EXTENSO: Record<string, string> = {
  grandmaster: 'gm',
  'international master': 'im',
  'fide master': 'fm',
  'candidate master': 'cm',
  'woman grandmaster': 'wgm',
  'woman international master': 'wim',
  'woman fide master': 'wfm',
  'woman candidate master': 'wcm',
}

const ABREVIACOES = new Set(['gm', 'im', 'fm', 'cm', 'wgm', 'wim', 'wfm', 'wcm'])

/** Títulos que só existem no feminino — a única pista de gênero que a busca dá. */
const ABREVIACOES_FEMININAS = new Set(['wgm', 'wim', 'wfm', 'wcm'])

/**
 * Títulos da coluna "Title", que costuma trazer dois para quem tem o aberto e o
 * feminino ("GM WGM"): o primeiro é o título principal.
 *
 * Devolve a abreviação em minúsculas (como a titulação aparece no sistema) e se
 * algum dos títulos é feminino. Título desconhecido vira `null`, não exceção.
 */
function lerTitulo(texto: string): { titulo: string | null; feminino: boolean } {
  const nome = texto.replace(/\s+/g, ' ').trim()

  if (nome === '' || nome.toLowerCase() === 'none') return { titulo: null, feminino: false }

  const abreviacoes = nome
    .split(' ')
    .map((pedaco) => pedaco.toLowerCase())
    .filter((pedaco) => ABREVIACOES.has(pedaco))

  if (abreviacoes.length > 0) {
    return {
      titulo: abreviacoes[0],
      feminino: abreviacoes.some((abreviacao) => ABREVIACOES_FEMININAS.has(abreviacao)),
    }
  }

  const porExtenso = TITULOS_POR_EXTENSO[nome.toLowerCase()]

  return porExtenso
    ? { titulo: porExtenso, feminino: ABREVIACOES_FEMININAS.has(porExtenso) }
    : { titulo: null, feminino: false }
}

/** "BRA" (o que a busca mostra) ou "BR" (o que o perfil mostrava) → "BRA". */
const normalizarFederacao = (valor: string): string | null => {
  const sigla = valor.trim().toUpperCase()

  if (sigla.length === 3) return countries.alpha3ToAlpha2(sigla) ? sigla : null

  return sigla.length === 2 ? (countries.alpha2ToAlpha3(sigla) ?? null) : null
}

/**
 * `prazoMs` existe para quem chama poder encurtar a espera. O envio da
 * inscrição usa o dado oficial só para enriquecer o cadastro, então prefere
 * desistir antes a segurar o jogador na tela de envio.
 */
type ConsultaOpcoes = { prazoMs?: number }

/**
 * Endereço da busca da FIDE.
 *
 * `index.phtml?search=<id>` é a página que o jogador vê, mas ela NÃO traz os
 * dados no HTML: é uma casca que preenche a tabela por AJAX. O endereço abaixo
 * é o que ela chama, e devolve a mesma tabela de resultados — nome, título,
 * federação, os três ratings e o ano de nascimento — em ~1,7 KB, contra os
 * 136 KB do antigo `/profile/<id>`.
 */
const urlDaBuscaFide = (id: string) =>
  `https://ratings.fide.com/incl_search_l.php?search=${encodeURIComponent(id)}&simple=1`

/**
 * Extrai os dados do jogador da busca da FIDE.
 *
 * Nunca lança: uma página que o `cheerio` não consegue montar (HTML truncado,
 * resposta de bloqueio com marcação quebrada) também é uma consulta que falhou,
 * não um erro que possa derrubar a inscrição de quem chamou.
 */
export async function verifyFideId(
  id: string,
  opcoes: ConsultaOpcoes = {}
): Promise<LookupResult> {
  const url = aplicarProxyFide(urlDaBuscaFide(id))
  const busca = await fetchHtml(
    url,
    opcoes.prazoMs ?? PRAZO_TOTAL_MS,
    cabecalhosDaBuscaFide(id)
  )

  if (!busca.ok) return { status: 'unavailable', motivo: busca.motivo }

  try {
    return extrairBuscaFide(busca.html, id)
  } catch (error) {
    const motivo = descreverErro(error)

    console.error(`[consulta-oficial] falha ao ler a busca ${id} da FIDE: ${motivo}`)

    return { status: 'unavailable', motivo }
  }
}

/**
 * A busca respondeu que não achou ninguém. O `(?<!\d)` protege o caso de
 * "10 record(s) found", que senão casaria com "0 record(s) found".
 */
const SEM_RESULTADO = /no results found|no record found|(?<!\d)0 record\(s\) found/i

/** Chaves das colunas que interessam da tabela de resultados. */
type Colunas = {
  id?: number
  nome?: number
  titulo?: number
  federacao?: number
  standard?: number
  rapid?: number
  blitz?: number
  nascimento?: number
}

/**
 * Nomes das colunas como a FIDE escreve → chave. O cabeçalho é lido antes das
 * células para que uma coluna nova no meio da tabela não troque os ratings.
 */
const COLUNAS: Record<string, keyof Colunas> = {
  fideid: 'id',
  name: 'nome',
  title: 'titulo',
  fed: 'federacao',
  std: 'standard',
  rpd: 'rapid',
  blz: 'blitz',
  byear: 'nascimento',
}

/**
 * Posições da tabela de hoje (FIDE ID | Name | Title | Tr.T. | Fed | Std. |
 * Rpd. | Blz. | B-Year). Só entram em cena para a coluna cujo cabeçalho deixou
 * de ser reconhecido — melhor que perder o rating inteiro por uma renomeação.
 */
const POSICOES_PADRAO: Colunas = {
  id: 0,
  nome: 1,
  titulo: 2,
  federacao: 4,
  standard: 5,
  rapid: 6,
  blitz: 7,
  nascimento: 8,
}

const normalizarCabecalho = (texto: string): string =>
  texto
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')

/** Texto de uma célula sem as quebras de linha da formatação da tabela. */
const textoLimpo = (valor: string): string => valor.replace(/\s+/g, ' ').trim()

function extrairBuscaFide(html: string, id: string): LookupResult {
  const $ = cheerio.load(html)

  if (SEM_RESULTADO.test($.root().text())) return { status: 'not-found' }

  const tabela = $('#table_results').first()

  if (tabela.length === 0) {
    // Sem a tabela: registra o começo da página para saber o que a FIDE
    // devolveu (bloqueio, captcha, página de erro...).
    console.error(
      `[consulta-oficial] FIDE devolveu uma busca sem a tabela de resultados do jogador ${id}: ` +
        textoLimpo($.root().text()).slice(0, 300)
    )

    return { status: 'unavailable', motivo: 'página inesperada da FIDE' }
  }

  const colunas: Colunas = {}
  tabela
    .find('thead th')
    .toArray()
    .forEach((cabecalho, indice) => {
      const chave = COLUNAS[normalizarCabecalho($(cabecalho).text())]

      if (chave && colunas[chave] === undefined) colunas[chave] = indice
    })

  const coluna = (chave: keyof Colunas) => colunas[chave] ?? POSICOES_PADRAO[chave]

  // A busca é feita pelo ID, mas ela também aceita nome: só a linha cujo ID é o
  // consultado serve — outra linha seria outro jogador.
  const linha = tabela
    .find('tbody tr')
    .filter((_, elemento) => {
      const indice = coluna('id')

      return indice !== undefined && textoLimpo($(elemento).find('td').eq(indice).text()) === id.trim()
    })
    .first()

  if (linha.length === 0) return { status: 'not-found' }

  const celula = (chave: keyof Colunas): string => {
    const indice = coluna(chave)

    return indice === undefined ? '' : textoLimpo(linha.find('td').eq(indice).text())
  }

  const name = celula('nome')

  if (name === '') {
    console.error(
      `[consulta-oficial] a busca da FIDE devolveu a linha ${id} sem nome: ` +
        textoLimpo($.root().text()).slice(0, 300)
    )

    return { status: 'unavailable', motivo: 'página inesperada da FIDE' }
  }

  const { titulo, feminino } = lerTitulo(celula('titulo'))
  const indiceDaFederacao = coluna('federacao')
  const bandeira =
    indiceDaFederacao === undefined
      ? ''
      : (linha.find('td').eq(indiceDaFederacao).find('img').attr('src')?.split('/').pop()?.replace('.svg', '') ?? '')

  return {
    status: 'found',
    player: {
      name,
      bornYear: celula('nascimento'),
      // A busca não informa o gênero; o título feminino é a única pista que ela
      // dá. Sem ele o gênero fica nulo — o mesmo que já acontece quando a CBX
      // confirma o ID no lugar da FIDE.
      genre: feminino ? 'f' : null,
      title: titulo,
      federation: normalizarFederacao(celula('federacao')) ?? normalizarFederacao(bandeira),
      idFide: id,
      // Os três ratings são sempre coletados juntos: quem chama escolhe o da
      // classe de tempo do torneio (standard, rapid ou blitz).
      ratings: {
        standard: toRating(celula('standard')),
        rapid: toRating(celula('rapid')),
        blitz: toRating(celula('blitz')),
      },
    },
  }
}

/** Extrai os dados do perfil em cbx.org.br. Também nunca lança. */
export async function verifyCbxId(
  id: string,
  opcoes: ConsultaOpcoes = {}
): Promise<LookupResult> {
  const busca = await fetchHtml(
    `https://www.cbx.org.br/jogador/${encodeURIComponent(id)}`,
    opcoes.prazoMs ?? PRAZO_TOTAL_MS
  )

  if (!busca.ok) return { status: 'unavailable', motivo: busca.motivo }

  try {
    return extrairPerfilCbx(busca.html)
  } catch (error) {
    const motivo = descreverErro(error)

    console.error(`[consulta-oficial] falha ao ler o perfil ${id} da CBX: ${motivo}`)

    return { status: 'unavailable', motivo }
  }
}

function extrairPerfilCbx(html: string): LookupResult {
  const $ = cheerio.load(html)
  const profileRow = $('#dados-jogador-row1').text().trim()
  const name = profileRow.match(/^([\s\S]+?)\s*Data Nasc\./)?.[1]?.trim() ?? ''

  if (name === '') return { status: 'not-found' }

  // Tabela "Evolução Rating": colunas Clássico, Rápido e Blitz (a primeira linha é a mais recente).
  const latestRatings = $('#ContentPlaceHolder1_gdvRating')
    .text()
    .replace(/\s+/g, ' ')
    .match(/[A-Za-zÀ-ÿ]{3}\/\d{4}(\d{4})(\d{4})(\d{4})/)

  const player: OfficialPlayer = {
    name,
    bornYear: profileRow.match(/Data Nasc\.:\s*([\d/]+)/)?.[1] ?? '',
    genre: null,
    title: null,
    federation: null,
    idFide: profileRow.match(/ID FIDE:\s*(\d+)/)?.[1] ?? null,
    ratings: {
      standard: toRating(latestRatings?.[1]),
      rapid: toRating(latestRatings?.[2]),
      blitz: toRating(latestRatings?.[3]),
    },
  }

  return { status: 'found', player }
}
