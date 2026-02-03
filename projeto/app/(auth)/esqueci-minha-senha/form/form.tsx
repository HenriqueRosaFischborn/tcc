'use client'

import Logo from "@/components/ui/logo"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import sendEmailAction from "./action"


export default function ResetPassword() {
    const params = useSearchParams()
    const param = String(params.get('email'))

    const email = param.split('').filter(el => el != '"').join('')

    const [emailError, setMailError] = useState(false)
    const [message, setMessage] = useState(false)

    useEffect(() => {
        async function action() {
            const res = await sendEmailAction(email)

            setMailError(!res)
            setMessage(true)
        }       
        action()
    }, [email, emailError, message])

    return (
        <>
            <div id='login-content'>
                <Logo width='200' />
                <h1>Atualizar senha</h1>
                <div className='form'>
                    <div style={{width: '100%'}}>
                        <p style={{textAlign: 'center'}} hidden={emailError || !message}>
                            <strong>Um email para redefinição de senha foi enviado para: </strong> <br />
                            <strong style={{color: 'var(--mainred)'}}>{email}</strong>
                        </p>
                        <p style={{textAlign: 'center'}} hidden={!emailError || !message}>
                            <strong>Email de usuário inválido</strong>
                        </p>     
                    </div>
                </div>
            </div>
        </>
    )
}