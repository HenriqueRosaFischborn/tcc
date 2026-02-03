import './unique.css'
import './responsive.css'
import Logo from '@/components/ui/logo'
import RegisterForm from './form/form'

export default function Register() {
    return (
        <>
            
            <div id='login-content'>
                <Logo width='200' />
                <h1>Cadastre-se</h1>

                
                <RegisterForm />
            </div>

            <div id='img'>
                <img src="/images/register.png" alt="login" fetchPriority='low' loading='lazy' decoding='async'/>
            </div>
        </>
    )
}