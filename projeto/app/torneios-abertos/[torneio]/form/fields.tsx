'use client'

import { useEffect, useState } from "react"
import { SelectCategorie } from "./selectCategorie"
import { usePathname } from "next/navigation"
import { FormState } from "@/lib/types"

type Divisions = {
    fide?: string,
    cbx?: string
}

type ErrorID = {
    id?: 'fide' | 'cbx',
    error?: Boolean
}

export default function Fields({setindividualPrice, state, setButton, setIdError, player}: {setIdError?: Function, setindividualPrice?: Function, setButton?: Function, player?: any, state: FormState}) {
    function handleEnterBlur(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.currentTarget.blur()
        }
    }
    
    const pathname = usePathname()
    const [idFide, setIdFide] = useState<String>('')
    
    const [divisions, setDivisions] = useState<Divisions>({})

    const [errorId, setErrorId] = useState<ErrorID>({error: false})
    function idVerify(e: React.FocusEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        
        if (value.split('').length < 8 && value != '') {
            const name = e.currentTarget.name
            if (name == 'idfide') {
                setErrorId({
                    error: true,
                    id: 'fide'
                })
            } else {
                setErrorId({
                    error: true,
                    id: 'cbx'
                })
            }
        } else {
            setErrorId({
                error: false,
            })
            setIdFide(value)
        }

        if (setIdError) {      
            if (value.split('').length == 8 || (value == '' && !e.currentTarget.classList.contains('needed'))) {
                setIdError(false)
            } else {
                setIdError(true)
            }
        }
    }

    function completeBlur() {
        const neededs = Array.from(document.querySelectorAll('.needed')).map(el => {
            if (el instanceof HTMLInputElement) {
                return el.value
            }
        })
        

        const isComplete = neededs.every(el => el?.trim() != '')

        
        if (setButton) {
            setButton(isComplete)
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
                <label htmlFor="name">Nome completo: {idFide != '' ? '(Exatamente como cadastrado na FIDE)' : ''}<p className="ast">*</p></label>
                <input className="needed" id="nome" type="text" name="name" onBlur={completeBlur} {...(pathname.includes('em-grupo') ? {
                    onChange: (e) => {
                        const father = e.currentTarget.parentElement?.parentElement?.parentElement?.parentElement?.firstChild?.firstChild
                        if (!(father instanceof HTMLElement)) return //isso serve pra ele identificar como elemento html
                        father.innerText = e.currentTarget.value
                        if (father.innerText == '') father.innerText = 'Henrique'
                    }
                } :{})} defaultValue={state.values && state.values[0] ? state.values[0].name : ''} onKeyDown={handleEnterBlur}/> 
                
            </div>
            
            {pathname.includes('em-grupo') ? ('') : (
                <>
                    <div style={{width: 'calc(50% - 15px)'}}>
                        <label htmlFor="city">Cidade que representa: <p className="ast">*</p></label>
                        <input className="needed" type="text" name="city" onBlur={completeBlur} defaultValue={state.values && state.values[0] ? state.values[0].city : ''} onKeyDown={handleEnterBlur}/>
                    </div>
                    
                    <div style={{width: 'calc(50% - 15px)'}}>
                        <label htmlFor="team">Clube que representa (se houver):</label>
                        <input type="text" name="team" onBlur={completeBlur} defaultValue={state.values && state.values[0] ? state.values[0].club : ''} onKeyDown={handleEnterBlur}/>
                    </div>
                </>
            )}

            <SelectCategorie setindividualPrice={setindividualPrice} state={state} setDivisions={division} blur={completeBlur}/>

            <div style={{width: 'calc(50% - 15px)'}}>
                <label htmlFor="idfide">ID Fide: {divisions.fide ? <p className="ast">*</p> : ''}</label>
                <input id="form-fide" className={divisions.fide ? 'needed' : ''} type="text" name="idfide" onKeyDown={handleEnterBlur} onBlur={(e) => {completeBlur(); idVerify(e)}} maxLength={8} onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')} defaultValue={state.values && state.values[0] ? state.values[0].idfide : ''}/>
                {errorId.error && errorId.id == 'fide' ? <p className="error">Este ID é inválido</p> : ''}
            </div>

            <div style={{width: 'calc(50% - 15px)'}}>
                <label htmlFor="idcbx">ID CBX: {divisions.cbx ? <p className="ast">*</p> : ''}</label>
                <input id="form-cbx" className={divisions.cbx ? 'needed' : ''} type="text" onKeyDown={handleEnterBlur} onBlur={(e) => {completeBlur(); idVerify(e)}} maxLength={8} onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')} name="idcbx" defaultValue={state.values && state.values[0] ? state.values[0].idcbx : ''}/>
                {errorId.error && errorId.id == 'cbx' ? <p className="error">Este ID é inválido</p> : ''}
            </div>      
        </>
    )
}