'use client'

import InputDate from "@/components/ui/input-date"
import { SelectCategorie } from "./selectCategorie"
import { useState } from "react"
import Fields from "./fields"

export default function FormInscriInGroup() {
    const [players, setPlayer] = useState([{name: 'Henrique'}, {name: 'Maria'}])
    
    const newPlayer = (
        <details>
            <summary onClick={clickArcodion} style={{display: 'flex', justifyContent: 'space-between' }}>
                <p>Henrique</p>
                <img src="/icons/arrow.png" alt="arrow" style={{width: '25px', rotate: '-90deg'}}/>
            </summary>
            <div className="form">
                <div style={{width: '100%'}}>
                    <input type="text" onChange={(e) => {
                        const father = e.currentTarget.parentElement?.parentElement?.parentElement?.firstChild?.firstChild
                        if (!(father instanceof HTMLElement)) return //isso serve pra ele identificar como elemento html
                        father.innerText = e.currentTarget.value
                        if (father.innerText == '') father.innerText = 'Henrique'
                    }}/>
                </div>
                <Fields />
            </div>
    
            <div className="buttons">
                <button className="button black">Remover</button>
                <button className="button red">Atualizar informações</button>
            </div>
        </details>
    )
    
    const [qr, setQr] = useState(false)
    
    async function click() {
        const x = Array.from(document.querySelectorAll('input'))
        
        const res = await fetch('/api/action/register-individual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nome: 'henrique', cidade: 'sombrio'})
        })

        const data = await res.json()
        setQr(true)
    }


    function changeImg(el: HTMLElement) {
        const img = el.querySelector('img')

        if (!img) return

        if (img.src == 'http://localhost:3000/icons/arrow.png') {
            img.src = '/icons/minus.png'
            img.style.rotate = 'none'
        } else {
            img.src = '/icons/arrow.png'
            img.style.rotate = '-90deg'
        }
    }

    function closeOthers(e: React.MouseEvent) {
        const body = e.currentTarget.parentElement?.parentElement
        if (!body) return
        const details = Array.from(body.querySelectorAll('details'))
        details.map((el) => {
            if (el != e.currentTarget.parentElement && el.open == true) {   
                changeImg(el)
                el.open = false 
            }
        })   
    }
    
    
    function clickArcodion(e: React.MouseEvent) {
       if (!e.currentTarget.parentElement) return
       
        changeImg(e.currentTarget.parentElement)
        closeOthers(e)
    }
    
    return (
        <>
            <div className="form">
                <div style={{width: 'calc(50% - 15px)'}}>
                    <label htmlFor="city">Cidade que representa:</label>
                    <input type="text" name="city" />
                </div>
                
                <div style={{width: 'calc(50% - 15px)'}}>
                    <label htmlFor="team">Clube que representa (se houver):</label>
                    <input type="text" name="team"/>
                </div>
                <div id="body" style={{width: '100%', gap: '5px'}}>
                    {players.map((el, i) => (
                        <details key={i}>
                            <summary onClick={clickArcodion} style={{display: 'flex', justifyContent: 'space-between' }}>
                                <p>{el.name}</p>
                                <img src="/icons/arrow.png" alt="arrow" style={{width: '25px', rotate: '-90deg'}}/>
                            </summary>
                            
                            <div className="form" style={{width: '100%', justifyContent: "center"}}>
                                <div className="form" style={{width: '90%', padding: '20px 0px'}}>
                                    <Fields players={el} /> {/*Depois tem que por pra enviar os dados*/}
                                    
                                    <div className="buttons">
                                        <button className="button black">Remover jogador</button>
                                        <button className="button red">Atualizar informações</button>
                                    </div>
                                </div>
                            </div>

                        </details>
                    ))}
                    <div id="new-player">
                        <div  className="form" style={{width: '90%'}}>
                            <h2 style={{width: '100%', textAlign: 'start'}}>Adicionar jogador</h2>
                            <Fields />
                            <button onClick={() => {
                                setPlayer([...players, {name: 'Henrique'}])
                            }} className="button red">Adicionar jogador</button>
                        </div>
                    </div>
                    <div style={{gap: '20px', marginTop: '30px'}}>
                        <h1 style={{marginBottom: '0px'}}>Valor total: R$75,00</h1>
                        <button onClick={click} className="button red big" style={{textAlign: 'start'}}>Efetuar Pagamento</button>
                    </div>

                    
                    {qr ? (
                        <div id="qr-div" style={{width: '100%'}}>
                            <p style={{width: '50%'}}>
                                <strong>Só mais um pouco... </strong><br />
                                <br />
                                Escaneie o QRcode com sua conta bancária ou use a chave PIX e confirme sua inscrição<br />
                                <br />
                                Você receberá um email algum tempo depois que o pagamento for efetuado
                            </p>
                            <img src="/qrcodeteste.webp" alt="qrcode" />
                            <div id="qr-key">
                                <p><strong>Chave pix:</strong></p>
                                <div className="input">
                                    <p>gdyu3go2u47uoy794rh</p>
                                    <img src="/icons/copy.png" alt="copy" />
                                </div>
                            </div>
                        </div>
                    ): ('')}
                </div>
            </div>
        </>
    )
}