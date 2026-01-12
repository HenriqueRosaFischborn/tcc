'use client'

import './unique.css'
import './responsive.css'
import { useState } from 'react'
import Switch from '@/components/ui/switch/switch'

type Tournment = {
    title: string,
    state: boolean,
    analogicTime: string,
    digitalTime : string,
    local: string,
    localLink: string,
    dateEvent: Date,
    dateInscri: Date,
    priceMin: number,
    priceMax: number,
    srcFolder: string
}


export default function Tournments() {
    const [tournments, setTournments] = useState<Tournment[]>([{
        title: 'V CIRCUITO BLITZ DE SOMBRIO',
        state: true,
        analogicTime: '3 + 5',
        digitalTime : '3 + 5',
        local: 'CITI, Rua João Goularte, Sombrio',
        localLink: '',
        priceMin: 10,
        priceMax: 25.90,
        dateEvent: new Date('2025-08-28T18:00:00'),
        dateInscri: new Date('2025-08-27T18:00:00'),
        srcFolder: '/folderteste.jpeg'       
    }, {
        title: 'V CIRCUITO BLITZ DE SOMBRIO',
        state: false,
        analogicTime: '3 + 5',
        digitalTime : '3 + 5',
        local: 'CITI, Rua João Goularte, Sombrio',
        localLink: '',
        priceMin: 10,
        priceMax: 25.90,
        dateEvent: new Date('2025-08-28T18:00:00'),
        dateInscri: new Date('2025-08-27T18:00:00'),
        srcFolder: '/folderteste.jpeg'       
    }])

    function changeState(e: React.MouseEvent, el: Tournment) {
        const newState = el
        newState.state = !newState.state
        setTournments((prev) => prev.map((elPrev: Tournment) => elPrev == el ? newState : elPrev))
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
                    }}/> ADICIONAR TORNEIO</button>
                </div>

                <div id='body'>
                    {tournments.map((el, i) => {return (
                        <div key={i} className='tournment'>
                            <div className='content'>
                                <div className='title'>
                                    <h2>{el.title}</h2>
                                </div>

                                <div className='state'>
                                    <p>Estado: </p>
                                    <Switch colorOn='#229614' colorOff='var(--darkgray)' el={el} onClick={changeState} defaultChecked={el.state}/>
                                    {el.state ? (
                                        <p style={{color: '#229614'}}>Ativo </p>
                                    ) : (
                                        <p style={{color: '#6b6b6bff'}}>Inativo </p>
                                    )}
                                </div>
                                <div className='body-informations'>
                                    <div className='informations'>
                                        <p>Tempos: {el.digitalTime} (digital) / {el.analogicTime} (analógico)</p>
                                        <a href={el.localLink}>Local: {el.local}</a>
                                        <p>Valor: {el.priceMin} - {el.priceMax}</p>
                                    </div>
                                    <div className='informations'>
                                        <p>Encerramento das inscrições:</p>
                                        <p>Data: {el.dateInscri.toLocaleString('pt-BR').split(',')[0]}</p>
                                        <p>Hora: {el.dateInscri.toLocaleString('pt-BR').split(',')[1]}</p>
                                    </div>
                                    <div className='informations'>
                                        <p>Início:</p>
                                        <p>Data: {el.dateEvent.toLocaleString('pt-BR').split(',')[0]}</p>
                                        <p>Hora: {el.dateEvent.toLocaleString('pt-BR').split(',')[1]}</p>
                                    </div>
                                </div>
                            </div>
                            <img src={el.srcFolder} alt="img" className='tournment-img'/>
                            <div className='buttons'>
                                <a href="#" className='button red'>Editar informações</a>
                                <button className='button black'>Deletar torneio</button>
                                <a href="#" className='button gray'>Analisar jogadores inscritos</a>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </>
    )
}