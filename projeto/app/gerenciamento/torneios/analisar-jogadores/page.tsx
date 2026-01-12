'use client'

import './unique.css'
import './responsive.css'
import { useState } from 'react'

type Player = {
    name: string,
    id: string,
    cat: string,
    division: string
}

export default function Players() {
    const [players, setPlayers] = useState<Player[]>([{
        name: 'João R. Freitas',
        id: '00064637',
        cat: 'Sub 8 masculino',
        division: 'ESCOLAR'
    }, {
        name: 'João R. Freitas',
        id: '00064637',
        cat: 'Sub 8 masculino',
        division: 'ESCOLAR'
    }, {
        name: 'João R. Freitas',
        id: '00064637',
        cat: 'Sub 8 masculino',
        division: 'ESCOLAR'
    }])
    
    return (
        <>
            <div id='content'>
                <h1>V CIRCUITO BLITZ DE SOMBRIO</h1>
                <div id='info'>
                    <div style={{flexDirection: 'column', marginBottom: '20px', gap: '30px'}}>
                        <a href="#" className='button red'>Regulamento</a>
                        <p>
                            Tempo: 3 + 5 <br />
                            Local: CITI, Rua João Goularte, Sombrio <br />
                            <br />
                            Encerramento das inscrições: <br />
                            Data: 28/08/2025&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hora:  18:00 <br />
                            <br />
                            Início: <br />
                            Data: 28/08/2025&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hora: 19:05
                        </p>
                    </div>
                    <img id='folder-img' src="/folderteste.jpeg" alt="folder" />
                </div>
                <div id='downloads'>
                    <h2>Baixar lista de jogadores:</h2>
                    <div className='buttons'>
                        <button className='button gray'>PDF</button>
                        <button className='button gray'>Swiss Manager</button>
                        <button className='button gray'>SwissSis</button>
                    </div>
                </div>

                <div id='players'>
                    <h2>Jogadores inscritos:</h2>
                    <div id='div-search-bar'>
                        <input type="text" />
                        <div id='icon-search'>
                            <img src="/icons/search.png" alt="search" />
                        </div>
                    </div>

                     <table>
                        <thead>
                            <tr><th ></th><th style={{width: '471px'}}>Nome:</th><th>ID FIDE:</th><th>Categoria:</th> <th>Divisão:</th></tr>
                        </thead>
                        <tbody>
                            {players.map((el, i) => {return (
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
                                    <td>{el.name} <a href="#">Ver mais</a></td>  
                                    <td>{el.id}</td> 
                                    <td>{el.cat}</td>
                                    <td>{el.division}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}