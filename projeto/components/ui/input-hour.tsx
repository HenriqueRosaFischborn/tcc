'use client'

import { useState } from "react"

export default function InputHour({blur, multiple}: {blur?: Function, multiple?: string}) {
    function change(input: HTMLInputElement) {
        const value = input.value.split('')

        if (value.length > 2 && !(value.includes(':'))) {
            value.splice(2, 0, ':')
            
        }

        if (value.length == 3 && value.includes(':')) {
            value.pop()
        }

        if (value.length == 1 && Number(value[0]) > 2) {
            value[0] = '2'
        }

        if (value.length == 2 && value[0] == '2' && Number(value[1]) > 4) {
            value[1] = '4'
        } 

        if (value.length == 4 && Number(value[3]) > 6) {
            value[3] = '6'
            value.push('0')
        }

        if (value.length == 5 && value[3] == '6' && Number(value[4]) > 0) {
            value[4] = '0'
        }

        input.value = value.join('')
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
                pattern="[0-9]" 
                name='hour' 
                className='needed' 
                onBlur={(e) => ownBlur(e.currentTarget)}
                placeholder="00:00"
                maxLength={5}
                onChange={(e) => change(e.currentTarget)}
            />
            {error ? (
                <p className="error">*Esta não é uma hora válida</p>
            ) : ('')}
        </>
    )
}