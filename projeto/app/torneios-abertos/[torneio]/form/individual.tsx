'use client'


import {useActionState, useEffect, useState } from "react";
import Fields from "./fields";
import actionInscriIndividual from "./action";
import Form from "next/form";
import { FormState } from "@/lib/types";
import { Funnel_Sans } from "next/font/google";

export default function FormInscriIndividual() {
    const initialValue: FormState= {}
    const [qr, setQr] = useState(false)
    const [state, formAction] = useActionState(actionInscriIndividual, initialValue)
    const [button, setUButton] = useState<Boolean>(false)
    const [errorId, setErrorId] = useState<Boolean>(false)

    const [price, setPrice] = useState<Number>(0)

    function setVPrice(price: Number) {
        setPrice(price)
    }

    function setButton(isComplete: Boolean) {
        setUButton(isComplete)
    }

    function setErrorIdF(idError: boolean) {
        setErrorId(idError)
    }

    console.log(state.values)
    
    useEffect(() => {
        if (state.message && state.values && state.message.includes('error-info-id')) {
            const p = document.querySelector('.pErr')

            if (!(p instanceof HTMLElement)) return

            p.focus()
        }
    }, [state])


    if (state.message && state.message.includes('Sucesso') && state.message[1].startsWith('/minhas-inscricoes/')) {
        window.location.href = state.message[1]
    }

    return (
        <>
            
                <div className="form">
                    
                    <Form action={formAction}>
                        <Fields setindividualPrice={setVPrice} state={state} setButton={setButton} setIdError={setErrorIdF}/>
                        <div style={{gap: '20px', marginTop: '30px'}} className={price != 0 && button && !errorId ? '' : 'disableDiv'}>
                            <h1 style={{marginBottom: '0px'}}>Valor total: {price == 0 ? '' : new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(Number(price))}</h1>
                            <button type="submit" className="button red big" style={{textAlign: 'start'}}>Efetuar Pagamento</button>
                            
                            
                            {state.message && state.values && state.message.includes('error-info-id') ? 
                                <p className="error pErr">As informações preenchidas não correspondem às oficialmente cadastradas na FIDE <br />
                                <p className="error">*Obs.: Preencha as informações (inclusive nome) exatamente como são demonstradas oficialmente na FIDE</p>
                                <a href={`https://ratings.fide.com/profile/${state.values[0].idfide}`} target="_blank" className="fide-link">Ver meu perfil FIDE</a> </p> 
                            : ('') }
                            {state.message && state.values && state.message.includes('Você já está inscrito') ? 
                                <p className="error pErr">Este ID FIDE já está inscrito</p>
                            : ('') }
                        </div>
                    </Form>
                </div>
        </>
    )
}