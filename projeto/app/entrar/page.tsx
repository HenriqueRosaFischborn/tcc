'use client'

import './unique.css'
import './responsive.css'
import Logo from '@/components/ui/logo'

export default function Login() {
    return (
        <>
            <div id='img'>
                <img src="/images/login.png" alt="login" />
            </div>
            <div id='login-content'>
                <Logo width='200' />
                <h1>Entrar</h1>
                <div className='form'>
                    <div style={{width: '100%'}} >
                        <label htmlFor="email">Email:</label>
                        <input type="email" name='email'/>
                    </div>

                    <div style={{width: '100%'}} >
                        <label htmlFor="password">Senha:</label>
                        <input type="password" name='password'/>
                        <a href='#' id='forgot-my-password'>Esqueci minha senha</a>
                    </div>

                    <div style={{alignItems: 'center'}}>
                        <button className='button red'>Entrar</button>
                        <p><strong>Não possui uma conta? <a href="/cadastro" style={{color: 'var(--mainred)'}}>Cadastre-se</a></strong></p> 
                    </div>
                </div>
            </div>
        </>
    )
}