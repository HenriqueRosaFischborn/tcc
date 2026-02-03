import Menu from "../header/menuList";
import Logo from "../ui/logo";
import './unique.css'
import './responsive.css'

export default function Footer({user, admin}: {user: boolean, admin: boolean}) {
    const year = new Date().getFullYear();
    
    return (
        <>
            <footer>
                <div id="footer-content" style={{
                    justifyContent: 'space-between',
                    rowGap: '20px',
                    alignItems: 'center',
                }}>
                    <div id="footer-menu" style={{gap: '20px', alignItems: 'stretch'}}>
                        <Logo />
                        <Menu user={user} admin={admin}/>
                    </div>

                    <div id="footer-menu-cell">
                        <Menu user={user} admin={admin}/>
                    </div>

                    <div id="social-medias">
                        <a href="https://www.instagram.com/sombrioxadrezclube/" target="_blank"><div style={{gap: '10px'}}><img src="/icons/instagram.png" alt=""/><h3>@sombrioxadrezclube</h3></div></a>
                        <a href="https://www.threads.com/@sombrioxadrezclube/" target="_blank"><div style={{gap: '10px'}}><img src="/icons/threads.png" alt=""/><h3>@sombrioxadrezclube</h3></div></a>
                    </div>
                </div>
                
                
                
                <h4>&copy; Sombrio Xadrez Clube, {year}. Todos os direitos reservados.</h4>
            </footer>
        </>
    )
}