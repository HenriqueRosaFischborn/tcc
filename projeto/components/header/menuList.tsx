'use client'

import logout from "@/app/(auth)/(logout)/action";
import { usePathname } from "next/navigation";
import { useTransition } from "react";


export default function Menu ({user, admin}: {user: boolean, admin: boolean}) {
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    function handleLogout() {
        startTransition(async () => {
            await logout()

            // Navegação completa: recarrega o documento inteiro, então a home
            // vem com todo o CSS. Um redirecionamento suave a partir do Server
            // Action deixaria a página sem os estilos dela. `replace` evita que
            // o "voltar" caia na página que exigia login.
            window.location.replace('/')
        })
    }

    return (
        <>
            <nav>
                <a className={`menu-item ${pathname == '/' ? 'selected' : ''}`} href="/" >Início</a>
                <a className={`menu-item ${pathname == '/torneios-abertos' ? 'selected' : ''}`} href="/torneios-abertos">Torneios abertos</a>
                {/* <a className={`menu-item ${pathname == '/historico-de-eventos' ? 'selected' : ''}`} href="/historico-de-eventos">Histórico de Eventos</a>
                <a className={`menu-item ${pathname == '/nossa-historia' ? 'selected' : ''}`} href="/nossa-historia">Nossa História</a> */}
                
                {user ? (
                    <a className={`menu-item ${pathname == '/minhas-inscricoes' ? 'selected' : ''}`} href="/minhas-inscricoes">Minhas inscrições</a>
                ) : (
                    <a className={`menu-item ${pathname == '/entrar' ? 'selected' : ''}`} href="/entrar">Entrar</a>
                )}
                {user && admin ? (
                    <a className={`menu-item ${pathname == '/gerenciamento' ? 'selected' : ''}`} href="/gerenciamento/torneios">Gerenciamento</a>
                ) : ('')}

                {user ? (
                    <button id="logout" onClick={handleLogout} disabled={isPending} className="">Sair</button>
                ) : ('')}
            </nav>
        </>
    )
}