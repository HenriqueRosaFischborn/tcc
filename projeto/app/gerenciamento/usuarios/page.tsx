'use client'

import './unique.css'
import './responsive.css'
import { useState } from 'react'
import Switch from '@/components/ui/switch/switch'

type User = {
    email: string,
    numberInscri: number,
    function: 'admin' | 'user'
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([{
        email: 'teste123@gmail.com',
        numberInscri: 3,
        function: 'admin'
    }, {
        email: 'teste123@gmail.com',
        numberInscri: 1,
        function: 'user'
    }])
    
    function changeFunction(e: React.MouseEvent, el: User) {
        const newEl = el
        newEl.function = newEl.function == 'admin' ? 'user' : 'admin'

        setUsers((prev) => prev.map((prevEl) => prevEl == el ? newEl : prevEl))
    }

    return (
        <>
            <div id='content'>

                <h1>Usuários</h1>

                
                    <div id='div-search-bar'>
                        <input type="text" />
                        <div id='icon-search'>
                            <img src="/icons/search.png" alt="search" />
                        </div>
                    </div>
                

                <table>
                    <thead>
                        <tr><th ></th><th style={{width: '500px'}}>Email:</th><th id='th-padding'>Inscrições atuais:</th><th id='th-padding-2'>Função:</th></tr>
                    </thead>
                    <tbody>
                        {users.map((el, i) => {return (
                            <tr key={i}>
                                <td className='input-user' style={{cursor: 'pointer'}} onClick={(e) => {
                                    if (!(e.target instanceof HTMLElement)) return
                                    if (e.target.className == 'input-user') {
                                        const input = e.currentTarget.querySelector('input')

                                        if (!(input instanceof HTMLElement)) return
    
                                        input.click()
                                    }
                                }}>
                                    <div style={{
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <input type='checkbox' />
                                    </div>
                                </td>  
                                <td>{el.email}</td>  
                                <td>
                                    <div className='td' >
                                        <p style={{color: 'var(--mainred)'}}>{el.numberInscri}</p> 
                                        {el.numberInscri == 1 ? 'inscrição' : 'inscrições'}
                                    </div>
                                </td> 
                                <td>
                                    <div className='td'>
                                        <Switch colorOff='black' colorOn='var(--mainred)' defaultChecked={el.function == 'admin'} el={el} onClick={changeFunction}/>
                                        
                                        {el.function == 'admin' ? (
                                            <p style={{color: 'var(--mainred)'}}>Admin</p>
                                        ) : (
                                            <p>Usuário</p>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    opacity: '0.5'
                }} className='button red'><img id='img-trash' src="/icons/trash.png" alt="" /> Deletar conta</button>
            </div>

            
        </>
    )
}