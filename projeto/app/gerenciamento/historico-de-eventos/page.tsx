'use client'

import './unique.css'
import './responsive.css'
import { useState } from 'react'


export default function EventsHistoric() {
    const [events, setEvents] = useState<{
        title: string,
        date: Date,
        state: boolean,
        text: string,
        imgSrc: string
    }[]>([{
        title: 'I CIRCUITO BLITZ DE SOMBRIO',
        date: new Date('2025-06-23'),
        state: true,
        text: 'O V CIRCUITO BLITZ DE SOMBRIO, promovido pelo Sombrio Xadrez Clube, ocorreu em 12 de outubro de 2025. O evento foi realizado no Centro Cultural de Curitiba',
        imgSrc: '/img-event-teste.png'
    }, {
        title: 'V CIRCUITO BLITZ DE SOMBRIO',
        date: new Date('2025-06-23'),
        state: false,
        text: 'O V CIRCUITO BLITZ DE SOMBRIO, promovido pelo Sombrio Xadrez Clube, ocorreu em 12 de outubro de 2025. O evento foi realizado no Centro Cultural de Curitiba',
        imgSrc: '/img-event-teste.png'
    }])
    
    function changeState(e: React.MouseEvent, event: {
        title: string,
        date: Date,
        state: boolean,
        text: string,
        imgSrc: string
    }) {
        
        const newEvent = event
        newEvent.state = !newEvent.state

        setEvents((prev) => prev.map((el) => el == event ? newEvent : el))
    }

    return (
        <>
            <div id='content'>
                <div style={{justifyContent: 'space-between'}}>
                    <h1>Histórico de eventos</h1>
                    <button className='button gray' style={{display: 'flex', alignItems: 'center', gap: '10px'}}><img src="/icons/plus.png" alt="plus" style={{
                        width: '26px',
                        height: 'auto',
                        objectFit: 'contain'
                    }}/> ADICIONAR POSTAGEM</button>
                </div>
                <div id='body'>
                    {events.map((el, i) => {return(
                        <div key={i} className='event'>
                            <div className='content'>
                                <div className='title'>
                                    <h2>{el.title}</h2>
                                    <h2>{el.date.toLocaleDateString('pt-BR')}</h2>
                                </div>

                                <div className='state'>
                                    <p>Estado: </p>
                                    <label className="switch">
                                        <input type="checkbox" onClick={(e) => changeState(e, el)} defaultChecked={el.state}/>
                                        <span className="slider"></span>
                                    </label>
                                    {el.state ? (
                                        <p style={{color: '#229614'}}>Ativo </p>
                                    ) : (
                                        <p style={{color: '#6b6b6bff'}}>Inativo </p>
                                    )}
                                </div>
                                <p className='text'>{el.text}</p>
                            </div>
                            <img src={el.imgSrc} alt="img" className='event-img'/>
                            <div className='buttons'>
                                <a href="#" className='button red'>Editar informações</a>
                                <button className='button black'>Deletar evento</button>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </>
    )
}