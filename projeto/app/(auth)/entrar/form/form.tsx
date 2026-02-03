'use client'

import { FormState } from "@/lib/types"
import Form from "next/form"
import { useActionState, useEffect, useState } from "react"
import loginAction from "./action"
import { verifyEmail } from "../../cadastro/form/verify-types"
import verifyEmailForgotPassword from "./verify-forgot-password"
import { useParams, useSearchParams } from "next/navigation"

export default function LoginForm() {
    const initialState: FormState = {}
    const [state, formAction] = useActionState(loginAction, initialState)
    const [emailError, setEmailError] = useState('')
    

    const params = useSearchParams()
    const urlBack = params.get('urlBack')
    


    if (state.message && typeof state.message[0] == 'string' && state.message[0] === 'Sucesso') {
        
        if (urlBack) {
            window.location.href = urlBack
        } else {
            window.location.href = '/'
        }
        
    }

    if (state.emptyFields?.includes('email')) {
        setEmailError('*Este campo é obrigatório')
    } else if (state.message?.includes('Email inválido')) {
        setEmailError('*Email inválido')
    } else if (state.message?.includes('Senha ou usuário incorretos')) {
        setEmailError('*Senha ou usuário incorretos')
    }

    
    
    async function forgotPassword() {
        const emailInput = document.querySelector('#email')

        if (emailInput instanceof HTMLInputElement) {

            
            const email = String(emailInput.value)
            


            const verify = await verifyEmailForgotPassword(email)

            if (verify) {
                setEmailError('*Este não é um email válido ou de usuário existente')
            } else {
                setEmailError('') 
                window.location.href = `/esqueci-minha-senha?email="${email}"`
            }
        }
    }
    
    return (
        <>
            <Form action={formAction} className='form' style={{justifyContent: 'center'}}>
                <div style={{width: '100%'}} >
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="text" name='email' defaultValue={state.values && state.values[0] ? state.values[0].email : ''}/>
                    {emailError && <p className="error">{emailError}</p>}
                </div>

                <div style={{width: '100%'}} >
                    <label htmlFor="password">Senha:</label>
                    <input type="password" name='password' autoComplete="new-password" defaultValue={state.values && state.values[0] ? state.values[0].password : ''}/>
                    {state.emptyFields?.includes('password') ? (<p className="error">*Este campo é obrigatório</p>) : ('')}
                    {(!state.emptyFields?.includes('password') && state.message?.includes('Senha ou usuário incorretos')) ? (<p className="error">*Senha ou usuário incorretos</p>) : ('')}
                    <button style={{textAlign: 'start', cursor: 'pointer'}} id='forgot-my-password' onClick={() => forgotPassword()} type="button">Esqueci minha senha</button>
                </div>

                <div style={{alignItems: 'center'}}>
                    <button style={{textAlign: 'center'}} className='button red'>Entrar</button>
                    <p><strong>Não possui uma conta? <a href="/cadastro" style={{color: 'var(--mainred)'}}>Cadastre-se</a></strong></p> 
                </div>
            </Form>
        </>
    )
}