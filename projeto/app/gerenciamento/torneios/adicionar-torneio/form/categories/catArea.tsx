'use client'

import { useState } from "react"

type Categorie = {
    name: string,
    value: string,
    from: number,
    to: number,
    justSuperior: boolean,
    fide: boolean,
    cbx: boolean
}

export default function CategorieArea({hasDivision}: {hasDivision: boolean}) {

    const [categories, setCategories] = useState<Categorie[]>([])

    const [dateError, setDateError] = useState<string>('')

    function changeValue(input: HTMLInputElement) {
        
        const onlyNumbers = input.value.replace(/\D/g, '')

        const number = Number(onlyNumbers) / 100

        const formatted = number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        })

        input.value = formatted
    }

    const [messageError, setMessageError] = useState<string>('')
    
    function sendCategorie() {
        const nameInput = document.querySelector('#nameCategorie') as HTMLInputElement
        const valueInput = document.querySelector('#valueCategorie') as HTMLInputElement
        const justSuperiorInput = document.querySelector('#superiorCategorie') as HTMLInputElement
        const toInput = document.querySelector('#toCategorie') as HTMLInputElement
        const fromInput = document.querySelector('#fromCategorie') as HTMLInputElement
        const fideInput = document.querySelector('#fideCategorie') as HTMLInputElement
        const cbxInput = document.querySelector('#cbxCategorie') as HTMLInputElement

        const categorie: Categorie = {
            name: nameInput.value,
            value: valueInput.value,
            justSuperior: justSuperiorInput ? justSuperiorInput.checked : false,
            fide: fideInput.checked,
            cbx: cbxInput.checked,
            to: Number(toInput.value),
            from: Number(fromInput.value)
        }

        if (categorie.name == '' || categorie.value == '' || toInput.value == '' || fromInput.value == '') {
            setMessageError('*Preencha todos os campos')
        } else {
            setMessageError('')
            if (categorie.from > categorie.to) {
                setDateError('*A data mínima para inscrição deve ser menor que a máxima')
            } else {
                setDateError('')
                
                if (String(categorie.to).length != 4 || String(categorie.from).length != 4) {
                    setDateError('*insira anos válidos')
                } else {
                    setDateError('')
    
                    if (String(categorie.to).length != 4 || String(categorie.from).length != 4) {
                        setDateError('*insira anos válidos')
                    } else {
                        setDateError('')
    
                        setCategories(prev => [...prev, categorie])
    
                        nameInput.value = ''
                        valueInput.value = ''
                        toInput.value = ''
                        fromInput.value = ''
                        fideInput.checked = false
                        cbxInput.checked = false
                        if (justSuperiorInput && justSuperiorInput.checked === true ) justSuperiorInput.checked = false

                        console.log(categorie)
                        
                    }
                }
    
            }
        }

    }

    function removeCategorie(index: number) {
        setCategories(prev => prev.filter((el, i) => i != index))
    }

    return (
        <>
            <div id='gray-area'>
                <h2>Categorias: </h2>
                <div className='form' style={{width: 'calc(50% - 15px)'}}>
                    <h3>Adicionar categoria:</h3>
                    <div id='cat-basic' style={{width: '100%'}}>
                        <div>
                            <label htmlFor="catName">Nome: <p className='ast'>*</p></label>
                            <input id="nameCategorie" type="text" name='catName' style={{display: 'flex', flex: 1}}/>
                        </div>
                        <div>
                            <label htmlFor="catPrice">Valor: <p className='ast'>*</p></label>
                            <input onChange={(e) => changeValue(e.currentTarget)} type="text" inputMode="numeric" pattern="[0-9]" id="valueCategorie" name='catPrice' style={{width: '30%'}} autoComplete="off"/>
                        </div>
                    </div>

                    <div id='interval' style={{width: '100%'}}>
                        <label htmlFor="">Intervalo de ano de nascimento para participação: <p className='ast'>*</p></label>
                        <div style={{width: '100%'}}>
                            <div style={{width: 'calc(50% - 5px)'}}>
                                <label htmlFor="catYearMin">De:</label>
                                <input id="fromCategorie" type="text" inputMode="numeric" pattern="[0-9]" maxLength={4} name='catYearMin'/>
                            </div>
                            <div style={{width: 'calc(50% - 5px)'}}>
                                <label htmlFor="catYearMin">Até:</label>
                                <input id="toCategorie" type="text" inputMode="numeric" pattern="[0-9]" maxLength={4} name='catYearMax'/>
                            </div>
                        </div>
                        {dateError != '' ? ( <p className="error">{dateError}</p> ) : ('')}
                    </div>

                    <div id='checkboxes' style={{width: '100%'}}>
                        <div>
                            <div>
                                <input id="fideCategorie" type="checkbox" name='fide'/>
                                <label  htmlFor="fide">Fide obrigatório</label>
                            </div>
                            <div>
                                <input id="cbxCategorie"  type="checkbox" name='cbx'/>
                                <label htmlFor="cbx">CBX obrigatório</label>
                            </div>
                        
                        </div>
                        {hasDivision ? (
                            <div>
                                <div>
                                    <input id="superiorCategorie" type="checkbox" name='division'/>
                                    <label htmlFor="cbx">Exclusivo SUPERIOR</label>
                                </div>
                            </div>
                        ) : ('')}
                    </div>

                    <div>
                        <button onClick={() => {sendCategorie()}} type="button" className='button black'>Adicionar categoria</button>
                        {messageError != '' ? ( <p className="error">{messageError}</p> ) : ('')}
                    </div>
                </div>

                <div id='body-tables'>
                    <table>
                        <thead>
                            <tr><th>Categorias {hasDivision ? '(ESCOLAR/SUPERIOR)' : ('')}</th></tr>
                        </thead>
                            <tbody>
                            {categories.filter((el) => !el.justSuperior).length > 0 ? (
                                <>
                                    {categories.map((el, i) => {
                                        if (!el.justSuperior) {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <div>
                                                            <p>{el.name} / {el.value} / ({el.from} - {el.to})</p>
                                                            <img src="/icons/cancel-red.png" alt="" fetchPriority='low' loading='lazy' decoding='async' onClick={() => removeCategorie(i)}/>    
                                                        </div>    
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })}
                                </>
                            ) : (
                                <tr>
                                    <td>
                                        <div>
                                            <p>Não há categorias cadastradas</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {hasDivision ? (
                        <table>
                            <thead>
                                <tr><th>EXCLUSIVO SUPERIOR</th></tr>
                            </thead>
                            {categories.filter(el => el.justSuperior).length > 0 ? (
                                <>
                                    {categories.map((el, i) => {
                                        if (el.justSuperior) {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <div>
                                                            <p>{el.name} / {el.value} / ({el.from} - {el.to})</p>
                                                            <img src="/icons/cancel-red.png" alt="" fetchPriority='low' loading='lazy' decoding='async' onClick={() => removeCategorie(i)}/>    
                                                        </div>    
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })}
                                </>
                            ) : (
                                <tr>
                                    <td>
                                        <div>
                                            <p>Não há categorias cadastradas</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </table>
                    ) : ('')}
                </div>
            </div>
        </>
    )
}