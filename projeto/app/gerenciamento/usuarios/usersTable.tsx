'use client'

import { useState } from 'react'
import './unique.css'
import './responsive.css'
import Switch from '@/components/ui/switch/switch'
import { changeFunction } from './changeFunction'

export default function Users({ usuarios }: { usuarios: any[] }) {
    const [search, setSearch] = useState("")

    const filteredUsers = usuarios.filter(el =>
        el.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <div id='content'>

                <h1>Usuários</h1>

                <div id='div-search-bar'>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Pesquisar por e-mail"
                    />
                    <div id='icon-search'>
                        <img
                            src="/icons/search.png"
                            alt="search"
                            fetchPriority='low'
                            loading='lazy'
                            decoding='async'
                        />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '500px' }}>Email:</th>
                            <th id='th-padding-2'>Função:</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((el, i) => (
                            <tr key={i}>
                                <td>{el.email}</td>
                                <td className='select' onChange={async () => {
                                    await changeFunction(el.email, !(el.admin))
                                    window.location.reload()
                                }} style={{color: `${el.admin ? 'var(--mainred)' : 'black'}`}}>
                                    <select defaultValue={el.admin ? 'true' : 'false'}>
                                        <option  style={{color: 'black'}} value={'false'}>Usuário</option>
                                        <option  style={{color: 'var(--mainred)'}} value={'true'}>Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </>
    )
}