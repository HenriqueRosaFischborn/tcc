'use client'

import { usePathname } from "next/navigation";
import { after } from "node:test";

import { useState } from "react";


export default function Menu () {
    const pathname = usePathname()

    return (
        <>
            <nav>
                <a className={`menu-item ${pathname == '/' ? 'selected' : ''}`} href="/" >Início</a>
                <a className={`menu-item ${pathname == '/torneios-abertos' ? 'selected' : ''}`} href="/torneios-abertos">Torneios Abertos</a>
                <a className={`menu-item ${pathname == '/historico-de-eventos' ? 'selected' : ''}`} href="/historico-de-eventos">Histórico de Eventos</a>
                <a className={`menu-item ${pathname == '/nossa-historia' ? 'selected' : ''}`} href="/nossa-historia">Nossa História</a>
                <a className={`menu-item ${pathname == '/minhas-inscricoes' ? 'selected' : ''}`} href="/minhas-inscricoes">Minhas Inscrições</a>
            </nav>
        </>
    )
}