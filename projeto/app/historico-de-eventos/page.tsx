'use client'

import './unique.css'
import './responsive.css'
import { useState } from 'react'

export default function HistoryEvents() {
    const events = '' //todos os eventos
    const [viewEvents, setViewEvents] = useState('') //eventos visíveis


    function openMonth(el: HTMLElement) {
        Array.from(document.querySelectorAll('.month-event')).map((el2) => {
            if (!(el2 instanceof HTMLElement)) return
            el2.style.color = 'var(--mainblack)'
        })
        el.style.color = 'var(--mainred)'

        //dar aqui um setViewEvents
    }

    function changeImg(el: HTMLElement) {
        const img = el.querySelector('img')
        if (!img) return
        if (img.src == 'http://localhost:3000/icons/arrow.png') {
            img.src = '/icons/minus.png'
            img.style.width = '15px'
        } else {
            img.src = '/icons/arrow.png'
        }
    }

    function closeOthers(e: React.MouseEvent) {
        const body = e.currentTarget.parentElement?.parentElement
        if (!body) return
        const details = Array.from(body.querySelectorAll('details'))
        details.map((el) => {
            if (el != e.currentTarget.parentElement && el.open == true) {   
                changeImg(el)
                el.open = false 
            }
        }) 

        if (!(e.currentTarget.parentElement instanceof HTMLElement)) return
        const firstMonth = Array.from(e.currentTarget.parentElement?.querySelectorAll('p'))[1]
        openMonth(firstMonth)  
    }
    
    function clickArcodion(e: React.MouseEvent) {
       if (!e.currentTarget.parentElement) return
       
        changeImg(e.currentTarget.parentElement)
        closeOthers(e)
    }
    
    return (
        <>
            <div id="title">
                <div className="content">
                    <h1>Histórico de eventos</h1>
                </div>

                <div id="img">
                    <img src="/images/img-history-events.png" alt="" />
                </div>
                
            </div>
            <div id='historic'>
                <div id='side-bar'>
                    {Array.from({length: 4}).map((el, i) => {return (
                        <details key={i}>
                            <summary onClick={clickArcodion}><img src="/icons/arrow.png" alt="" style={{width: '20px', height: 'auto', objectFit: 'contain', rotate: '180deg'}}/><p className='year-event'>2025</p></summary>
                            <p onClick={(e) => openMonth(e.currentTarget)} className='month-event'>Fevereiro</p>
                            <p onClick={(e) => openMonth(e.currentTarget)} className='month-event'>Janeiro</p>
                        </details>
                    )})}
                </div>
                <div className='content'>
                    {Array.from({length: 2}).map((el, i) => {return (
                        <div className='event' key={i}>
                            <div style={{width: '100%', justifyContent: 'space-between'}}>
                                <h2>V CIRCUITO BLITZ DE SOMBRIO</h2>
                                <h2 className='date'>23/06/2025</h2>
                            </div>
                            <p>O V CIRCUITO BLITZ DE SOMBRIO, promovido pelo Sombrio Xadrez Clube, ocorreu em 12 de outubro de 2025. O evento foi realizado no Centro Cultural de Curitiba...</p>

                            <a href="#" className='button red'>Ver mais</a>
                        </div>
                    )})}
                </div>
            </div>
        </>
    )
}