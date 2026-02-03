"use client"

import { useState } from "react";
import Logo from "../ui/logo";
import './unique.css'
import './responsive.css'
import Menu from "./menuList";


export default function Header({user, admin}: {user: boolean, admin: boolean}) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header>
                <div className="menu" style={{justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                    <Logo />

                    <div>
                        <div id="icon-menu-cell">
                            <img id="hamburguer" src="/icons/menu-hamburguer.png" alt="menu" onClick={() => setMenuOpen(!menuOpen)}/>
                        </div>
                        <div id="menu-desktop" style={{gap: '30px',}}>
                            <Menu user={user} admin={admin}/>
                        </div>            
                    </div>
                </div>

                <div id="menu-cell" className={`${!menuOpen ? 'closed' : 'open'}`} style={{flexDirection: 'column'}}>
                    <Menu user={user} admin={admin}/>
                </div>

                <div style={{
                    height: '15px',
                    width: '100%',
                    backgroundColor: 'var(--mainblack)',
                }}></div>
            </header>
        </>
    )
}