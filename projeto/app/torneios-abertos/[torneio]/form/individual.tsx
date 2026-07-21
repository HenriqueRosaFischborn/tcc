'use client'


import {useActionState, useContext, useEffect, useState } from "react";
import Fields from "./fields";
import actionInscriIndividual from "./action";
import Form from "next/form";
import { FormState } from "@/lib/types";
import { searchCbx, searchFide } from "./searchID";
import { supabase } from "@/lib/supabaseClient";
import { TournamentContext } from "@/lib/context";

type DataPlayer = {
    name: string,
    bornYear: string,
    genre: string,
    title: string,
    idFide: string,
    ratings: {
        standard: string,
        rapid: string,
        blitz: string
    }
}

export default function FormInscriIndividual() {
    
    
    function handleEnterBlur(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.currentTarget.blur()
        }
    }

    const initialValue: FormState= {}
   
    const [state, formAction] = useActionState(actionInscriIndividual, initialValue)
    const [button, setUButton] = useState<Boolean>(false)
    const [comprovante, setComprovante] = useState<string>('')

    function uploadFile(file: File) {
        const fileName = String(file.name.split('\\').at(-1))
        const extension = fileName.split('.').at(-1)

        if (extension == 'jpeg' || extension == 'png' || extension == '.jpg') {
            setComprovante(fileName)
        }

        const nome = document.getElementById('nome')
        const input = document.getElementById('input-comprovante')

        if (nome && input) {
            nome.focus()
            nome.blur()
            input.focus()
        }
    }
   

    const [price, setPrice] = useState<Number>(0)

    function setVPrice(price: Number) {
        setPrice(price)
    }

    function setButton(isComplete: Boolean) {
        setUButton(isComplete)
    }
    
    useEffect(() => {
        if (state.message && state.values && state.message.includes('error-info-id')) {
            const p = document.querySelector('.pErr')

            if (!(p instanceof HTMLElement)) return

            p.focus()
        }
    }, [state])

    const [qr, setQr] = useState<string>('')
    const [qrKey, setQrKey] = useState<string>('')
    useEffect(() => {
        async function loadQr() {
            

            const chave = String(document.getElementById('qr-key')?.innerText)
            const src = String(document.getElementById('qr-src')?.innerText)
            
            setQrKey(chave)
            setQr(src)
        } 
        loadQr()
    }, [])


    if (state.message && state.message.includes('Sucesso') && state.message[1].startsWith('/minhas-inscricoes/')) {
        window.location.href = state.message[1]
    }

    const [hasFide, setHasFide] = useState(true)
    const [idFide, setIdFide] = useState<string>('')
    const [idCbx, setIdCbx] = useState<string>('')
    const [errorIdFide, setErrorIdFide] = useState<string>('')
    const [errorIdCbx, setErrorIdCbx] = useState<string>('')
    const [playerFide, setPlayerFide] = useState<DataPlayer>()
    const [playerCbx, setPlayerCbx] = useState<DataPlayer>()
    
    
    async function sendIds(input: HTMLInputElement) {
        const id = input.value.trim()
        const type = input.name === 'idfide' ? 'fide' : 'cbx'

        if (type === 'fide' && id != idFide) {
            setPlayerFide(undefined)

            if (id.length !== 7 && id.length !== 8) {
                setErrorIdFide('*Insira um ID válido')
                setIdFide('')
                return
            }

            setErrorIdFide('')

            
                const dataPlayerFide = await searchFide(id) as DataPlayer

                if (
                    !dataPlayerFide ||
                    dataPlayerFide.name === 'Usuário FIDE não encontrado'
                ) {
                    setPlayerFide(undefined)
                    setErrorIdFide('*Usuário FIDE não encontrado')
                    setIdFide('')
                    return
                }

                setIdFide(id)
                setPlayerFide(dataPlayerFide)
                setErrorIdFide('')
            
        }

        if (type === 'cbx' && id != idCbx) {
            setPlayerCbx(undefined)

            if (id.length < 4 || id.length > 6) {
                setErrorIdCbx('*Insira um ID válido')
                setIdCbx('')
                return
            }

            setErrorIdCbx('')

            
                const dataPlayerCbx = await searchCbx(id) as DataPlayer

                if (
                    !dataPlayerCbx ||
                    dataPlayerCbx.name === 'Usuário CBX não encontrado'
                ) {
                    setPlayerCbx(undefined)
                    setErrorIdCbx('*Usuário CBX não encontrado')
                    setIdCbx('')
                    return
                }

                setIdCbx(id)
                setPlayerCbx(dataPlayerCbx)
                setErrorIdCbx('')
            
        }
    }

    const id = useContext(TournamentContext);

    return (
        <>
                <div className="form">
                    
                    <Form action={formAction}>
                        {/* <p className="error">*Para checar sua informação, <a className='fide-link' href="https://ratings.fide.com/" target='_blank' >Clique aqui</a> </p> */}
                        <div style={{width: '100%'}} className="select-radios">
                            <div>
                                <input className="division-for" type='radio' defaultChecked name='hasFide' value={'true'} onChange={() => setHasFide(!hasFide)}/>
                                <label htmlFor="division-for">Possuo ID FIDE e ID CBX</label>
                            </div>
                            <div>
                                <input className="division-for" type='radio' name='hasFide' value={'false'} onChange={() => setHasFide(!hasFide)}/>
                                <label htmlFor="division-for">Não possuo ID FIDE e ID CBX</label>
                                <p className="obs obs-fide">*Se não possuir cadastro FIDE, selecione esta opção</p>
                            </div>
                        </div>
                        
                        {hasFide ? (<>
                            <div style={{width: 'calc(50% - 15px)'}}>
                                <label htmlFor="idfide">ID Fide: <p className="ast">*</p></label>
                                <input id="form-fide" type="text" name="idfide" defaultValue={idFide} onKeyDown={handleEnterBlur} maxLength={8} inputMode="numeric"  onInput={(e) => {e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')}} onBlur={(e) => sendIds(e.currentTarget)}/>
                                {errorIdFide != '' ? <p className="error">{errorIdFide}</p> : ''}
                            </div>
                            <input type="text" hidden name="playerFide" value={JSON.stringify(playerFide)}/>
                        
                            <div style={{width: 'calc(50% - 15px)'}}>
                                <label htmlFor="idcbx">ID CBX:<p className="ast">*</p></label>
                                <input id="form-cbx" type="text" name="idcbx" defaultValue={idCbx} onKeyDown={handleEnterBlur} maxLength={8} inputMode="numeric" onInput={(e) => {e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')}} onBlur={(e) => sendIds(e.currentTarget)}/>
                                {errorIdCbx != '' ? <p className="error">{errorIdCbx}</p> : ''}
                            </div> 
                            <input type="text" hidden name="playerCbx" value={JSON.stringify(playerCbx)}/>
                        </>): ''}
                        
                        {(hasFide && (!playerFide || !playerCbx)) || (errorIdFide != '' || errorIdCbx != '') ? (<> 
                            <p className="error">*Preencha os campos acima antes de continuar</p> 
                        </>): ''}

                        
                        <div className={`form ${(hasFide && (!playerFide || !playerCbx)) || (errorIdFide != '' || errorIdCbx != '') ? 'disableDiv' : ''}`} style={{width: '100%'}}> 
                            <Fields id={id} playerCbx={playerCbx} playerFide={playerFide} hasFide={hasFide} setindividualPrice={setVPrice} state={state} setButton={setButton} />
                            
                            <div id="qr-div" >
                                <div>
                                    <h2>Efetuar pagamento e confirmar inscrição:</h2>
                                    <p>Escaneie o QRcode com sua conta bancária ou use a chave PIX e confirme sua inscrição</p>    
                                    <div id="qr-key">
                                        <p><strong>Ou copie o código:</strong></p>
                                        <div className="input">
                                            <p>{qrKey}</p>
                                            <img src="/icons/copy.png" alt="copy" onClick={() => {
                                                navigator.clipboard.writeText(String(qrKey))
                                                alert('Copiado para área de transferência...')
                                            }}/>
                                        </div>
                                    </div>
                                </div>

                                <img src={qr} alt="qrcode" />
                            </div>
                            
                            <div className='upload-file' style={{width: '100%'}}>
                                <button onClick={() => document.getElementById('input-comprovante')?.click()} type='button' className='button red'><img src="/icons/upload.png" alt="" id="uploadIcon" fetchPriority='low' loading='lazy' decoding='async'/> Anexar comprovante <span style={{fontSize: '10pt'}}>(.jpg / .jpeg / .png)</span></button>
                                {comprovante != '' ? (
                                    <p>({comprovante})</p>
                                ) : ('')}
                                <input onChange={(e) => {
                                    const files = e.currentTarget.files?.[0]

                                    if (!files) return
                                    
                                    uploadFile(files)
                                }} type='file' id='input-comprovante' name='fileComprovante' accept='.jpg,.jpeg,.png' hidden={true}/>     
                            </div>


                            <div id="final-button" className={price != 0 && button && comprovante != '' ? '' : 'disableDiv'}>

                                <h1 style={{marginBottom: '0px'}}>Valor total: {price == 0 ? '' : new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(Number(price))}</h1>

                                
                                <button type="submit" className="button red big" style={{textAlign: 'start'}}>Solicitar inscrição</button>
                                
                                
                                {/* {state.message && state.values && state.message.includes('error-info-id') ? 
                                    <p className="error pErr">As informações preenchidas não correspondem às oficialmente cadastradas na FIDE <br />
                                    <p className="error">*Obs.: Preencha as informações (inclusive nome) exatamente como são demonstradas oficialmente na FIDE</p>
                                    <a href={`https://ratings.fide.com/profile/${state.values[0].idfide}`} target="_blank" className="fide-link">Ver meu perfil FIDE</a> </p> 
                                : ('') } */}
                                {state.message && state.values && state.message.includes('Você já está inscrito') ? 
                                    <p className="error pErr">Este ID FIDE já está inscrito</p>
                                : ('') } 
                            </div>
                        </div>
                    </Form>
                </div>
        </>
    )
}