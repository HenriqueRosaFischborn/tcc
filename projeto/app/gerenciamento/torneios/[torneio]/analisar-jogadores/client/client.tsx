'use client'

import { Player } from '@/lib/types'
import { useState } from 'react'

export default function BodyClient({players, comprovantes}: {players: Player[], comprovantes: {[key: string]: string}}) {
    
    return (
        <>
            
                <div id='downloads'>
                    <h2>Baixar lista de jogadores:</h2>
                    <div className='buttons'>
                        <button className='button gray'><img src="/icons/download.png" alt="" fetchPriority='low' loading='lazy' decoding='async'/> PDF</button>
                        <button className='button gray'><img src="/icons/download.png" alt="" fetchPriority='low' loading='lazy' decoding='async'/> Swiss Manager (.xls)</button>
                    </div>
                </div>

                <div id='players'>
                    <h2>Jogadores inscritos:</h2>
                    {/* <div id='div-search-bar'>
                        <input type="text" />
                        <div id='icon-search'>
                            <img src="/icons/search.png" alt="search" fetchPriority='low' loading='lazy' decoding='async'/>
                        </div>
                    </div> */}
                    <div id='table'>
                        <table>
                            <thead>
                                <tr>
                                    <th ></th>
                                    <th>Status:</th>
                                    <th>Nome:</th>
                                    <th>Comprovante:</th>
                                    <th>ID FIDE:</th>
                                    <th>ID CBX:</th>
                                    <th>Rating FIDE:</th>
                                    <th>Rating CBX:</th>
                                    <th>Categoria:</th>
                                    <th>Divisão:</th>
                                    <th>Cidade:</th>
                                    <th>Clube:</th>
                                </tr>
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
                                        <td>{el.status}</td>
                                        <td>{el.name}</td>  
                                        <td><a href={comprovantes[el.uuid]} target='_blank'>Ver comprovante</a></td>
                                        <td>{el.id_fide}</td> 
                                        <td>{el.id_cbx}</td>
                                        <td>{el.rtg_fide}</td>
                                        <td>{el.rtg_cbx}</td>
                                        <td>{el.categoria.name}</td>
                                        <td>{el.divisoes.name}</td>
                                        <td>{el.city}</td>
                                        <td>{el.club ? el.club : 'Nenhum'}</td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </div>

            
        </>
    )
}