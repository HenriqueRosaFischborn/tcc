'use client'

import './unique.css'
import './responsive.css'
import Logo from '@/components/ui/logo'

export default function Register() {
    return (
        <>
            
            <div id='login-content'>
                <Logo width='200' />
                <h1>Cadastre-se</h1>
                <div className='form'>
                    <div style={{width: '100%'}} >
                        <label htmlFor="email">Email:</label>
                        <input type="email" name='email'/>
                    </div>

                    <div style={{width: '100%'}} >
                        <label htmlFor="password">Senha:</label>
                        <input type="password" name='password'/>
                    </div>

                    <div style={{alignItems: 'center'}}>
                        <button className='button red'>Cadastrar</button>
                    </div>
                </div>
            </div>

            <div id='img'>
                <img src="/images/register.png" alt="login" />
            </div>
        </>
    )
}