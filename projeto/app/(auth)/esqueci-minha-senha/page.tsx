'use client'

import './unique.css'
import './responsive.css'
import Logo from '@/components/ui/logo'
import ResetPassword from './form/form'

export default function Login() {
    
    
    return (
        <>
            <div id='img'>
                <img src="/images/password.png" alt="login" fetchPriority='low' loading='lazy' decoding='async'/>
            </div>
            <ResetPassword />
        </>
    )
}