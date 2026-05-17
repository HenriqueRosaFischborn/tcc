'use client'

import { useEffect, useState } from "react"
import { SelectCategorie } from "./selectCategorie"
import { usePathname } from "next/navigation"
import { FormState } from "@/lib/types"
import { error } from "console"

type Divisions = {
    fide?: string,
    cbx?: string
}

type ErrorID = {
    id?: 'fide' | 'cbx',
    error?: Boolean
}

type DataPlayer = {
    name: string,
    bornYear: string,
    genre: string,
    title: string,
    idFide: string,
    ratings: {
        standard: string,
        rapid: string,
        blitz: string
    }
}

export default function Fields({playerCbx, playerFide, hasFide, setindividualPrice, state, setButton, setIdError, player}: {playerCbx?: DataPlayer, playerFide?: DataPlayer, hasFide: boolean, setIdError?: Function, setindividualPrice?: Function, setButton?: Function, player?: any, state: FormState}) {
    function handleEnterBlur(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.currentTarget.blur()
        }
    }
    
    const pathname = usePathname()
    
    const [divisions, setDivisions] = useState<Divisions>({})

    const [errorName, setErrorName] = useState<string>('')
    const [errorInfo, setErrorInfo] = useState<string>('')

    function completeBlur() {
        if (hasFide && playerCbx && playerFide) {
            const name = document.getElementById('nome')
            if (name instanceof HTMLInputElement && name.value.trim() != '' && name.value != playerCbx.name) {
                setErrorName(`*Nome incorreto, o nome fornecido no ID é: ${playerCbx.name}`)
            } else {
                setErrorName('')
            }

            
            const date = document.getElementById('input-date')
            const genre = Array.from(document.querySelectorAll('.radio-genre')).filter((el) => {
                if (el instanceof HTMLInputElement && el.checked) {
                    return true
                }
            })[0].parentElement?.querySelector('h3')?.innerText

            
            if ((date instanceof HTMLInputElement && date.value.trim() != '' && date.value != playerCbx.bornYear) || (genre == 'Masculino' ? 'm' : 'f') != playerFide.genre) {
                console.log((genre == 'Masculino' ? 'm' : 'f') != playerFide.genre)
                
                setErrorInfo(`*Informações inválidas, as informações cadastradas são: ${playerCbx.bornYear} - ${playerFide.genre == 'm' ? 'Masculino' : 'Feminino' }`)
            } else {
                setErrorInfo('')
            }

        }
        
        const neededs = Array.from(document.querySelectorAll('.needed')).map(el => {
            if (el instanceof HTMLInputElement) {
                return el.value
            }
        })

        const isComplete = neededs.every(el => el?.trim() != '')

        
        if (setButton) {
            setButton(isComplete && ((hasFide && errorName == '' && errorInfo == '') || !hasFide))
        }
    }
    
    function division(divisionss: Divisions) {
        setDivisions(divisionss)
    }
    
    useEffect(() => {
        completeBlur()
    }, [divisions])

    return (
        <>
            <div style={{width: '70%'}}>
                <label htmlFor="name">Nome completo: <p className="ast">*</p></label>
                <input className="needed" id="nome" type="text" name="name" onBlur={completeBlur} {...(pathname.includes('em-grupo') ? {
                    onChange: (e) => {
                        const father = e.currentTarget.parentElement?.parentElement?.parentElement?.parentElement?.firstChild?.firstChild
                        if (!(father instanceof HTMLElement)) return //isso serve pra ele identificar como elemento html
                        father.innerText = e.currentTarget.value
                        if (father.innerText == '') father.innerText = 'Henrique'
                    }
                } :{})} defaultValue={state.values && state.values[0] ? state.values[0].name : ''} onKeyDown={handleEnterBlur}/> 
                {hasFide && errorName != '' ? <p className="error">{errorName}</p> : ''}
            </div>
            
            {pathname.includes('em-grupo') ? ('') : (
                <>
                    <div style={{width: 'calc(50% - 15px)'}}>
                        <label htmlFor="city">Cidade que representa: <p className="ast">*</p></label>
                        <input className="needed" type="text" name="city" onBlur={completeBlur} defaultValue={state.values && state.values[0] ? state.values[0].city : ''} onKeyDown={handleEnterBlur}/>
                    </div>
                    
                    <div style={{width: 'calc(50% - 15px)'}}>
                        <label htmlFor="team">Clube que representa (se houver):</label>
                        <input type="text" name="team" defaultValue={state.values && state.values[0] ? state.values[0].club : ''} onKeyDown={handleEnterBlur}/>
                    </div>
                </>
            )}

            <SelectCategorie hasFide={hasFide} errorInfo={errorInfo} setindividualPrice={setindividualPrice} state={state} setDivisions={division} blur={completeBlur}/>     
        </>
    )//console
}