'use client'

import Form from "next/form"

import registerAction from "./action"
import { FormState } from "@/lib/types"
import { useActionState } from "react"


export default function RegisterForm() {
    const initialState: FormState = {}
    const [state, formAction] = useActionState(registerAction, initialState)
    
    
    if (state.message && typeof state.message[0] == 'string' && state.message[0] === 'Sucesso') {
        window.location.href = '/'
    }
    let emailError

    if (state.emptyFields?.includes('email')) {
        emailError = '*Este campo é obrigatório'
    } else if (state.message?.includes('Email inválido')) {
        emailError = 'Email inválido'
    } else if (state.message?.includes('Este email já existe')) {
        emailError = 'Este usuário já foi cadastrado'
    }

    return(
        <>
            <Form action={formAction} className='form' style={{justifyContent: 'center'}}>
                <div style={{width: '100%'}} >
                    <label htmlFor="email">Email:</label>
                    <input type="text" name='email' defaultValue={state.values && state.values[0] ? state.values[0].email : ''}/>
                    {emailError && <p className="error">{emailError}</p>}
                    

                </div>

                <div style={{width: '100%'}}>
                    <label htmlFor="password">Senha:</label>
                    <input type="password" name='password' autoComplete="new-password" defaultValue={state.values && state.values[0] ? state.values[0].password : ''}/>
                    {state.emptyFields?.includes('password') ? (<p className="error">*Este campo é obrigatório</p>) : ('')}
                </div>

                <div style={{alignItems: 'center'}}>
                    <button style={{textAlign: 'center'}} className='button red' type="submit">Cadastrar</button>
                </div>
            </Form>

            
        </>
    )
}