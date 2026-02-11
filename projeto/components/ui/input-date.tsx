'use client'

import { FormState } from "@/lib/types";
import IMask from "imask";
import { useEffect, useRef } from "react";


export default function InputDate({blur, state, multiple, now}: {blur?: Function, state?: FormState, multiple?: string, now?: boolean}) {
    const yearNow = new Date().getFullYear()
    const inputRef = useRef<HTMLInputElement | null>(null)
    
    function nowBlur(input: HTMLInputElement) {
        
        if (now && input.value.length == 10) {
            const [d, m, y] = input.value.split('/').map(Number)
            
            const dateNow = new Date(Date.now())

            const dateinput = new Date(y, m -1, d)

            if (dateinput < dateNow) {
                input.value = dateNow.toLocaleDateString('pt-BR')
            }
        }
    }

    function handleEnterBlur(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.currentTarget.blur()
        }
    }

    useEffect(() => {
        if (!inputRef.current) return

        IMask(inputRef.current, {
        mask: Date,
        pattern: 'd{/}m{/}Y',
        lazy: true,
        blocks: {
            d: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 31,
            maxLength: 2,
            },
            m: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
            maxLength: 2,
            },
            Y: {
            mask: IMask.MaskedRange,
            from: yearNow - 100,
            to: now ? 9999 : yearNow,
            },
        },
        format: (date: any) => {
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const year = date.getFullYear()
            return `${day}/${month}/${year}`
        },
        parse: (str: any) => {
            const [day, month, year] = str.split('/').map(Number)
            return new Date(year, month - 1, day)
        },
        autofix: true,
        })
    }, [])

    return (
        <input
        ref={inputRef}
        id={multiple && multiple == 'sim' ? '' : "input-date"}
        className={`needed ${multiple && multiple == 'sim' ? 'input-date' : ''}`}
        name="borndate"
        onKeyDown={handleEnterBlur}
        onBlur={blur ? (e) => {blur(e.currentTarget.value); nowBlur(e.currentTarget)} : () => {}}
        defaultValue={state && state.values && state.values[0] ? state.values[0].borndate : ''}
        />
    )
}