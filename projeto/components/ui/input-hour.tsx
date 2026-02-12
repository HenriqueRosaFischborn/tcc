'use client'

import { useState } from "react"

export default function InputHour({blur, multiple}: {blur?: Function, multiple?: string}) {
    function change(input: HTMLInputElement) {
        let numbers = input.value.replace(/\D/g, '')

        
        numbers = numbers.slice(0, 4)

        let hours = numbers.slice(0, 2)
        let minutes = numbers.slice(2, 4)

        if (hours.length === 2) {
            let h = Number(hours)
            if (h > 23) h = 23
            hours = h.toString().padStart(2, '0')
        }

        if (minutes.length === 2) {
            let m = Number(minutes)
            if (m > 59) m = 59
            minutes = m.toString().padStart(2, '0')
        }

        if (numbers.length <= 2) {
            input.value = hours
        } else {
            input.value = `${hours}:${minutes}`
        }
    }

    const [error, setError] = useState<boolean>(false)
    function ownBlur(input: HTMLInputElement) {
        if (blur) {
            blur(input)
        }

        if (input.value.split('').length != 5) {
            setError(true)
        } else {
            setError(false)
        }

        
    }
    
    
    return (
        <>
            <input 
                type="text" 
                inputMode="numeric" 
                pattern="[0-9]{2}:[0-9]{2}" 
                name='hour' 
                className='needed' 
                onBlur={(e) => ownBlur(e.currentTarget)}
                placeholder="00:00"
                defaultValue={'18:00'}
                maxLength={5}
                onChange={(e) => change(e.currentTarget)}
            />
            {error ? (
                <p className="error">*Esta não é uma hora válida</p>
            ) : ('')}
        </>
    )
}