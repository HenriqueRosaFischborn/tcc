'use client'

import './unique.css'
import './responsive.css'
import Logo from '@/components/ui/logo'

export default function Login() {
    return (
        <>
            <div id='img'>
                <img src="/images/password.png" alt="login" />
            </div>
            <div id='login-content'>
                <Logo width='200' />
                <h1>Atualizar senha</h1>
                <div className='form'>
                    <div style={{width: '100%'}}>
                        <p><strong>Email:</strong></p>
                        <p style={{color: 'var(--mainred)'}}><strong>henriquerosafischborn@gmail.com</strong></p>
                    </div>

                    <div style={{width: '100%'}} >
                        <label htmlFor="password">Nova Senha:</label>
                        <input type="password" name='password'/>
                    </div>

                    <div style={{alignItems: 'center'}}>
                        <button className='button red'>Atualizar senha</button>
                        
                    </div>
                </div>
            </div>
        </>
    )
}