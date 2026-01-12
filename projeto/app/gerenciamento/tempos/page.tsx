'use client'

import './unique.css'
import './responsive.css'
import { use, useState } from 'react'

export default function Times() {
    const [times, setTimes] = useState<{
        time: number,
        plus: number
    }[]>([{
        time: 3,
        plus: 5
    }, {
        time: 15,
        plus: 3
    }])
    
    function removeItem(e: React.MouseEvent) {
        console.log(e.target)
    }
    
    return (
        <>
            <h1>Tempos</h1>

            <div className='form'>
                <h2>ADICIONAR TEMPO:</h2>
                <div>
                    <label htmlFor="time">Tempo(min):</label>
                    <input type="number" name='time' onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}/>
                </div>
                <div>
                    <label htmlFor="plus">Acréscimo(s):</label>
                    <input type="number" name='plus' onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}/>
                </div>

                <button className='button black'>Adicionar tempo</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr><th>Tempos Cadastrados</th></tr>
                    </thead>
                    <tbody>
                        {times.map((el, i) => { return (  
                            <tr key={i} ><td><p>{el.time} + {el.plus}</p><img className='cancel-img' src="/icons/cancel-red.png" alt="x" onClick={(e) => removeItem(e)} /></td></tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </>
    )
}