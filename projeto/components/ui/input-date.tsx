'use client'

import { FormState } from "@/lib/types";
import IMask from "imask";
import { useEffect, useRef } from "react";


export default function InputDate({blur, state}: {blur?: Function, state?: FormState}) {
    const yearNow = new Date().getFullYear()
    const inputRef = useRef<HTMLInputElement | null>(null)

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
            to: yearNow,
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
        id="input-date"
        className="needed"
        name="borndate"
        onKeyDown={handleEnterBlur}
        onBlur={blur ? (e) => blur(e.currentTarget.value) : () => {}}
        defaultValue={state && state.values && state.values[0] ? state.values[0].borndate : ''}
        />
    )
}