'use client'


import InputDate from "@/components/ui/input-date";
import Form from "next/form";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { SelectCategorie } from "./selectCategorie";
import Fields from "./fields";

export default function FormInscriIndividual() {
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
        console.log(data)
    }

    return (
        <>
            
                <div className="form">

                    <Fields />

                    <div style={{gap: '20px', marginTop: '30px'}}>
                        <h1 style={{marginBottom: '0px'}}>Valor total: R$15,00</h1>
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
        </>
    )
}