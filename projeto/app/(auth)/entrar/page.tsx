'use client'

import './unique.css'
import './responsive.css'
import Logo from '@/components/ui/logo'
import LoginForm from './form/form'

export default function Login() {
    return (
        <>
            <div id='img'>
                <img src="/images/login.png" alt="login" fetchPriority='low' loading='lazy' decoding='async'/>
            </div>
            <div id='login-content'>
                <Logo width='200' />
                <h1>Entrar</h1>
                <LoginForm />
            </div>
        </>
    )
}