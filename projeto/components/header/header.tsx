"use client"

import { useState } from "react";
import Logo from "../ui/logo";
import './unique.css'
import './responsive.css'
import Menu from "./menu";
import Modal from "./modal";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModal] = useState(false)

    return (
        <>
            <header>
                <div className="menu" style={{justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                    <Logo />

                    <div>
                        <div id="icon-menu-cell">
                            <img id="userImg" src="/icons/user.png" alt="user" onClick={() => setModal(!modalOpen)}/>

                            <img id="hamburguer" src="/icons/menu-hamburguer.png" alt="menu" onClick={() => setMenuOpen(!menuOpen)}/>
                        </div>
                        <div id="menu-desktop" style={{gap: '30px',}}>
                            <Menu />
                            <img id="userImg" src="/icons/user.png" alt="logo" onClick={() => setModal(!modalOpen)}/>
                        </div>            
                    </div>
                </div>

                <div id="menu-cell" className={`${!menuOpen ? 'closed' : 'open'}`} style={{flexDirection: 'column'}}>
                    <Menu />
                </div>

                <div style={{
                    height: '15px',
                    width: '100%',
                    backgroundColor: 'var(--mainblack)',
                }}></div>
            </header>

            {modalOpen && (
                <Modal onClose={() => setModal(false)}/>
            )}
        </>
    )
}