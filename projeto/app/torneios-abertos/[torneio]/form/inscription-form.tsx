'use client'

import { useActionState, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TournamentContext } from '@/lib/context'
import { validarComprovante } from '@/lib/comprovante'
import PlayerFields from './player-fields'
import { selectCategory } from './select-category'
import { submitInscription } from './submit-inscription'
import type {
  CategoryStatus,
  Genre,
  InscriptionState,
  LookupResult,
  OfficialPlayer,
} from './types'
import { formatCurrency, consultarComPrazo, handleEnterBlur, motivoDaFalha } from './utils'
import { confirmarIdFidePelaCbx } from './confirmacao-cbx'
import { verifyCbxId, verifyFideId } from './verify-player'

type IdKind = 'fide' | 'cbx'

type IdState = {
  value: string
  /** ID já conferido. */
  verifiedId: string
  player: OfficialPlayer | null
  /** Erro do jogador (ID inexistente, número divergente). Impede o envio. */
  error: string
  /**
   * Site oficial indisponível ou lento. Aparece na tela, mas NÃO impede o
   * envio: o formulário não pode travar por causa de um site de terceiro.
   */
  aviso: string
  /** Consulta em andamento. */
  loading: boolean
}

const emptyIdState: IdState = {
  value: '',
  verifiedId: '',
  player: null,
  error: '',
  aviso: '',
  loading: false,
}

const avisoIndisponivel = (site: string, motivo?: string) =>
  `A ${site} não respondeu agora${motivo ? ` (${motivo})` : ''}. ` +
  'A inscrição segue normalmente e os dados serão conferidos na análise.'

/**
 * Roda uma consulta oficial sem deixar nenhuma falha escapar.
 *
 * `verifyFideId`/`verifyCbxId` já devolvem `unavailable` em vez de lançar, mas
 * entre elas e a tela há a chamada de rede da server action: função na Vercel
 * interrompida, sem rede, aba de um deploy anterior... Nada disso pode deixar o
 * formulário carregando para sempre nem travar o envio.
 */
async function consultarSemTravar(
  id: string,
  consultar: (id: string) => Promise<LookupResult>
): Promise<LookupResult> {
  try {
    return await consultarComPrazo(id, consultar)
  } catch (error) {
    return { status: 'unavailable', motivo: motivoDaFalha(error) }
  }
}

// O ID FIDE tem 7 ou 8 dígitos. O ID CBX não tem regra de tamanho: o cadastro
// da CBX tem IDs de 1 a 6 dígitos.
const fideIdValido = (id: string) => id.length === 7 || id.length === 8

const initialState: InscriptionState = { status: 'idle' }

export default function InscriptionForm() {
  const tournament = useContext(TournamentContext)
  const router = useRouter()

  // `isPending` fica true do clique até a action responder: o envio confere os
  // IDs nos sites oficiais e envia os emails, então demora o suficiente para o
  // jogador precisar de um aviso de que a requisição está em andamento.
  const [state, formAction, isPending] = useActionState(submitInscription, initialState)

  // ---- Identificação (ID FIDE / CBX) ----
  const [hasIds, setHasIds] = useState(true)
  const [fide, setFide] = useState<IdState>(emptyIdState)
  const [cbx, setCbx] = useState<IdState>(emptyIdState)

  // ---- Dados do jogador ----
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [club, setClub] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [genre, setGenre] = useState<Genre>('masc')
  const [identityTouched, setIdentityTouched] = useState(false)
  const [divisionChoice, setDivisionChoice] = useState<'default' | 'absolute'>('default')
  const [receiptName, setReceiptName] = useState('')
  const receiptInput = useRef<HTMLInputElement | null>(null)

  const playerFide = hasIds ? fide.player : null
  const playerCbx = hasIds ? cbx.player : null

  function handleIdChange(kind: IdKind, value: string) {
    const digits = value.replace(/\D/g, '')
    const update = kind === 'fide' ? setFide : setCbx

    update((current) =>
      digits === current.verifiedId
        ? { ...current, value: digits }
        : { ...emptyIdState, value: digits }
    )
  }

  /**
   * Confere o ID FIDE digitado com o cadastro da CBX, que informa o número.
   *
   * É a segunda opinião: entra quando a consulta direta à FIDE não respondeu.
   * Quando a FIDE confirmou o ID, o que ela manda é mais completo — nome,
   * federação, título e ratings — e nada do que a CBX diga o substitui.
   */
  function conferirFidePelaCbx(estado: IdState, jogadorCbx: OfficialPlayer | null): IdState {
    // Sem o cadastro da CBX não há com o que comparar.
    if (!jogadorCbx) return estado

    // A FIDE já confirmou este ID: o perfil dela é a fonte mais completa.
    if (estado.player) return estado

    const id = estado.value.trim()
    const confirmacao = confirmarIdFidePelaCbx(id, jogadorCbx)

    // O cadastro da CBX aponta outro número: é erro de digitação.
    if (!confirmacao.ok && confirmacao.divergente) {
      return { ...estado, verifiedId: '', player: null, error: `*${confirmacao.motivo}`, aviso: '', loading: false }
    }

    // Cadastro da CBX sem ID FIDE é limitação do dado, não erro do jogador:
    // o campo continua valendo e o envio não é travado.
    return {
      ...estado,
      verifiedId: id,
      player: confirmacao.ok ? confirmacao.player : null,
      error: '',
    }
  }

  /**
   * Consulta o ID FIDE no site da FIDE.
   *
   * A FIDE não atende requisição vinda de IP de datacenter (é o caso da Vercel)
   * e deixa a conexão pendurada em vez de recusá-la — por isso a consulta tem
   * prazo. Quando ele estoura (ou o site retorna erro) o campo apenas avisa: o
   * jogador segue em frente, com o cadastro da CBX como conferência do número.
   */
  async function checkFideId() {
    const id = fide.value.trim()

    if (id === '' || fide.loading || fide.verifiedId === id) return

    if (!fideIdValido(id)) {
      setFide({ ...emptyIdState, value: id, error: '*Insira um ID válido' })
      return
    }

    setFide((atual) => ({ ...atual, verifiedId: '', player: null, error: '', aviso: '', loading: true }))

    const resultado = await consultarSemTravar(id, verifyFideId)

    setFide((atual) => {
      // O jogador já mudou o campo enquanto a consulta acontecia.
      if (atual.value.trim() !== id) return atual

      if (resultado.status === 'found') {
        return { ...atual, verifiedId: id, player: resultado.player, error: '', aviso: '', loading: false }
      }

      // A FIDE não confirmou o ID — seja porque não achou, seja porque não
      // respondeu. A tela NÃO avisa nada: o jogador não tem o que fazer com
      // isso, e a inscrição não depende dessa confirmação. O servidor consulta
      // de novo no envio (e completa depois, em segundo plano); o que continuar
      // faltando o árbitro preenche na análise.
      return {
        ...atual,
        verifiedId: '',
        player: null,
        error: '',
        aviso: '',
        loading: false,
      }
    })
  }

  async function checkCbxId() {
    const id = cbx.value.trim()

    if (id === '' || cbx.loading || cbx.verifiedId === id) return

    setCbx((atual) => ({ ...atual, verifiedId: '', player: null, error: '', aviso: '', loading: true }))

    const resultado = await consultarSemTravar(id, verifyCbxId)
    const jogadorCbx = resultado.status === 'found' ? resultado.player : null

    // Com o cadastro da CBX em mãos dá para conferir o ID FIDE digitado antes —
    // é a conferência que vale quando a FIDE não responde.
    if (jogadorCbx) {
      setFide((latest) =>
        latest.value.trim() === '' ? latest : conferirFidePelaCbx(latest, jogadorCbx)
      )
    }

    setCbx((latest) => {
      // O jogador já mudou o campo enquanto a consulta acontecia.
      if (latest.value.trim() !== id) return latest

      if (resultado.status === 'found') {
        return { ...latest, verifiedId: id, player: resultado.player, error: '', aviso: '', loading: false }
      }

      if (resultado.status === 'not-found') {
        return {
          ...latest,
          verifiedId: '',
          player: null,
          error: '*Usuário CBX não encontrado',
          aviso: '',
          loading: false,
        }
      }

      // Site fora do ar ou demorou demais: avisa e segue.
      return {
        ...latest,
        verifiedId: '',
        player: null,
        error: '',
        aviso: avisoIndisponivel('CBX', resultado.motivo),
        loading: false,
      }
    })
  }

  /** Um ID digitado e já resolvido. */
  const idPreenchido = (state: IdState) =>
    state.value !== '' && state.error === '' && !state.loading
  const idsBlocked = hasIds && !(idPreenchido(fide) && idPreenchido(cbx))
  const consultando = hasIds && (fide.loading || cbx.loading)

  // ---- Conferência do nome / data de nascimento com o cadastro da CBX ----
  const nameError = useMemo(() => {
    if (!playerCbx || !identityTouched) return ''
    if (name.trim() === '' || name.trim() === playerCbx.name.trim()) return ''

    return `*Nome incorreto, o nome fornecido no ID é: ${playerCbx.name}`
  }, [playerCbx, name, identityTouched])

  // O cadastro da CBX não informa gênero, então o que dá para conferir é a data.
  // Gênero e rating ficam para a análise do árbitro.
  const infoError = useMemo(() => {
    if (!playerCbx || !identityTouched) return ''
    if (birthDate.trim() === '' || birthDate.trim() === playerCbx.bornYear.trim()) return ''

    return `*Data de nascimento incorreta, a cadastrada é: ${playerCbx.bornYear}`
  }, [playerCbx, birthDate, identityTouched])

  // ---- Categoria (definida pela data de nascimento e pelo gênero) ----
  // As categorias e divisões chegam prontas do servidor junto com o torneio,
  // então a escolha é uma conta local: aparece na hora, sem consulta ao servidor.
  const dateComplete = birthDate.trim().length === 10

  const categoryResult = useMemo(
    () =>
      dateComplete
        ? selectCategory(tournament.categories ?? [], tournament.divisions ?? [], birthDate, genre)
        : null,
    [dateComplete, tournament.categories, tournament.divisions, birthDate, genre]
  )

  const categoryStatus: CategoryStatus = categoryResult === null ? 'idle' : categoryResult.status
  const category = categoryResult?.status === 'found' ? categoryResult.category : null
  const price = category?.price ?? 0

  // ---- Envio ----
  const fieldsComplete = name.trim() !== '' && city.trim() !== '' && dateComplete
  const identityOk = !hasIds || (nameError === '' && infoError === '')
  const canSubmit = price !== 0 && fieldsComplete && identityOk && receiptName !== ''
  const showCategory =
    dateComplete && categoryStatus === 'found' && (!hasIds || infoError === '')

  useEffect(() => {
    if (state.status === 'success') router.replace('/minhas-inscricoes')
  }, [state.status, router])

  // A mesma conferência do servidor (`lib/comprovante.ts`), feita antes de
  // enviar para avisar o jogador na hora em que ele escolhe o arquivo.
  function handleReceiptChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]

    if (!file) return

    const validacao = validarComprovante(file)

    if (!validacao.ok) {
      event.currentTarget.value = ''
      setReceiptName('')
      alert(validacao.motivo)
      return
    }

    setReceiptName(file.name)
  }

  async function copyPixKey() {
    try {
      await navigator.clipboard.writeText(String(tournament.pixKey))
      alert('Copiado para a área de transferência.')
    } catch {
      // Navegador sem permissão de área de transferência: o código continua visível na tela.
    }
  }

  return (
    <div className="form">
      <form
        action={formAction}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.preventDefault()
        }}
      >
        <div style={{ width: '100%' }} className="select-radios">
          <div>
            <input
              className="division-for"
              id="possui-ids"
              type="radio"
              name="hasFide"
              value="true"
              checked={hasIds}
              onChange={() => setHasIds(true)}
            />
            <label htmlFor="possui-ids">Possuo ID FIDE e ID CBX</label>
          </div>
          <div>
            <input
              className="division-for"
              id="nao-possui-ids"
              type="radio"
              name="hasFide"
              value="false"
              checked={!hasIds}
              onChange={() => setHasIds(false)}
            />
            <label htmlFor="nao-possui-ids">Não possuo ID FIDE e ID CBX</label>
            {/* <p className="obs obs-fide">*Se não possuir cadastro FIDE, selecione esta opção</p> */}
          </div>
        </div>

        {hasIds ? (
          <>
            <div style={{ width: 'calc(50% - 15px)' }}>
              <label htmlFor="form-fide">ID FIDE: <p className="ast">*</p></label>
              <input
                id="form-fide"
                type="text"
                name="idfide"
                value={fide.value}
                maxLength={8}
                inputMode="numeric"
                onChange={(event) => handleIdChange('fide', event.currentTarget.value)}
                onBlur={checkFideId}
                onKeyDown={handleEnterBlur}
              />
              {fide.error !== '' ? <p className="error">{fide.error}</p> : ''}
              {fide.aviso !== '' ? <p className="obs">{fide.aviso}</p> : ''}
            </div>
            <input
              type="text"
              hidden
              name="playerFide"
              value={playerFide ? JSON.stringify(playerFide) : ''}
              readOnly
            />

            <div style={{ width: 'calc(50% - 15px)' }}>
              <label htmlFor="form-cbx">ID CBX:<p className="ast">*</p></label>
              <input
                id="form-cbx"
                type="text"
                name="idcbx"
                value={cbx.value}
                maxLength={8}
                inputMode="numeric"
                onChange={(event) => handleIdChange('cbx', event.currentTarget.value)}
                onBlur={checkCbxId}
                onKeyDown={handleEnterBlur}
              />
              {cbx.error !== '' ? <p className="error">{cbx.error}</p> : ''}
              {cbx.aviso !== '' ? <p className="obs">{cbx.aviso}</p> : ''}
            </div>
            <input
              type="text"
              hidden
              name="playerCbx"
              value={playerCbx ? JSON.stringify(playerCbx) : ''}
              readOnly
            />
          </>
        ) : (
          ''
        )}

        {consultando ? <p className="obs">Carregando...</p> : ''}

        {idsBlocked && !consultando ? (
          <p className="error">*Preencha os campos acima antes de continuar</p>
        ) : (
          ''
        )}

        <div className={`form ${idsBlocked ? 'disableDiv' : ''}`} style={{ width: '100%' }}>
          <PlayerFields
            hasIds={hasIds}
            name={name}
            onNameChange={setName}
            city={city}
            onCityChange={setCity}
            club={club}
            onClubChange={setClub}
            onFieldBlur={() => setIdentityTouched(true)}
            nameError={nameError}
            onBirthDateChange={setBirthDate}
            genre={genre}
            onGenreChange={setGenre}
            infoError={infoError}
            categoryStatus={categoryStatus}
            category={category}
            showCategory={showCategory}
            divisionChoice={divisionChoice}
            onDivisionChange={setDivisionChoice}
          />

          {tournament.qrCodeUrl ? (
            <div id="qr-div">
              <div>
                <h2>Efetuar pagamento:</h2>
                <p>
                  Escaneie o QR Code com sua conta bancária ou use a chave Pix e confirme sua
                  inscrição.
                </p>
                <div id="qr-key">
                  <p><strong>Ou copie o código:</strong></p>
                  <div className="input">
                    <p>{tournament.pixKey}</p>
                    <img src="/icons/copy.png" alt="copy" onClick={copyPixKey} />
                  </div>
                </div>
              </div>

              <img src={tournament.qrCodeUrl} alt="qrcode" />
            </div>
          ) : (
            ''
          )}

          <div className="upload-file" style={{ width: '100%' }}>
            <button
              onClick={() => receiptInput.current?.click()}
              type="button"
              className="button red"
            >
              <img
                src="/icons/upload.png"
                alt=""
                id="uploadIcon"
                fetchPriority="low"
                loading="lazy"
                decoding="async"
              />
              {' Anexar comprovante '}
            </button>
            {receiptName !== '' ? <p>({receiptName})</p> : ''}
            <input
              ref={receiptInput}
              onChange={handleReceiptChange}
              type="file"
              id="input-comprovante"
              name="fileComprovante"
              accept="image/*"
              hidden
            />
          </div>

          <div id="final-button" className={canSubmit ? '' : 'disableDiv'}>
            <h1 style={{ marginBottom: '0px' }}>
              Valor total: {price === 0 ? '' : formatCurrency(price)}
            </h1>

            <button
              type="submit"
              className={`button red big ${isPending ? 'disableDiv' : ''}`}
              style={{ textAlign: 'start' }}
              disabled={isPending}
            >
              Solicitar inscrição
            </button>

            {isPending ? <p className="error pErr">Enviando inscrição...</p> : ''}

            {state.status === 'duplicate' ? (
              <p className="error pErr">Este jogador já está inscrito neste torneio (mesmo ID FIDE ou CBX).</p>
            ) : (
              ''
            )}
            {state.status === 'error' ? <p className="error pErr">{state.message}</p> : ''}
          </div>
        </div>
      </form>
    </div>
  )
}
