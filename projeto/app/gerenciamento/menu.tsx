'use client'

import { usePathname } from "next/navigation"


export default function MenuListAdmin() {
    const pathname = usePathname()
    
    return (
        <>
            <nav>
                <div className={`${pathname.includes('/gerenciamento/torneios') ? 'selected' : ''}`}>
                    <a  href="/gerenciamento/torneios" >Torneios</a>
                </div>
                <div className={`${pathname.includes('/gerenciamento/tempos') ? 'selected' : ''}`}>
                    <a  href="/gerenciamento/tempos">Tempos</a>
                </div>
                <div className={`${pathname.includes('/gerenciamento/usuarios') ? 'selected' : ''}`}>
                    <a  href="/gerenciamento/usuarios">Usuários</a>
                </div>
                <div className={`${pathname.includes('/gerenciamento/historico-de-eventos') ? 'selected' : ''}`}>
                    <a  href="/gerenciamento/historico-de-eventos">Histórico de eventos</a>
                </div>
            </nav>
        </>
    )
}