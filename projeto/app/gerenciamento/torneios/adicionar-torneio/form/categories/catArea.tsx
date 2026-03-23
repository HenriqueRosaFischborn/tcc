'use client'

import { useEffect, useState } from "react"
import verifyCategorieDates from "./verifydates"

type Categorie = {
    name: string,
    value: string,
    from: number,
    to: number,
    justSuperior: boolean,
    fide: boolean,
    cbx: boolean
}

export default function CategorieArea({hasDivision, setErrorCategories}: {hasDivision: boolean, setErrorCategories?: Function}) {

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
    
    async function sendCategorie() {
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

                    // const x = categories.filter(el => el.justSuperior == categorie.justSuperior)

                    // const isX = x.some(el => el.name == categorie.name)
    
                    if (categories.filter(el => el.justSuperior == categorie.justSuperior).some(el => el.name == categorie.name)) {
                        setMessageError('*Uma categoria com este nome já foi adicionada')
                    } else {
                        setMessageError('')
    
                        const newCategories = [...categories, categorie]
                        
                        const res = await verifyCategorieDates(newCategories.filter(el => el.justSuperior == categorie.justSuperior))
                        
                        
                        const res2 = await verifyCategorieDates(newCategories)


                        if (res?.error) {
                            setMessageError('*Os intervalos de datas não podem se chocar')
                        } else if (res2?.error) {
                            setMessageError('*O intervalo de datas de categorias SUPERIOR não deve se chocar com ESCOLAR')
                        } else {
                            setMessageError('')
                            
                            const x = [...newCategories.filter(el => el.justSuperior != categorie.justSuperior), ...res.organized]
                            setCategories(x)
                        
                        
                            nameInput.value = ''
                            valueInput.value = ''
                            toInput.value = ''
                            fromInput.value = ''
                            fideInput.checked = false
                            cbxInput.checked = false
                            if (justSuperiorInput && justSuperiorInput.checked === true ) justSuperiorInput.checked = false
                        }
                    }
                }
    
            }
        }

    }

    function removeCategorie(index: number) {
        setCategories(prev => prev.filter((el, i) => i != index))
    }

    useEffect(() => {
        if (setErrorCategories) {
            if (categories.length > 0) {
                setErrorCategories(false)
            } else {
                setErrorCategories(true)
            }
        }
    }, [categories])

    return (
        <>
            <div id='gray-area'>
                <h2>Categorias: </h2>
                <div className='form' style={{width: 'calc(50% - 15px)'}}>
                    <h3>Adicionar categoria:</h3>
                    <div id='cat-basic' style={{width: '100%'}}>
                        <div>
                            <label >Nome: <p className='ast'>*</p></label>
                            <input id="nameCategorie" type="text" style={{display: 'flex', flex: 1}}/>
                        </div>
                        <div>
                            <label >Valor: <p className='ast'>*</p></label>
                            <input onChange={(e) => changeValue(e.currentTarget)} type="text" inputMode="numeric" pattern="[0-9]" id="valueCategorie" style={{width: '30%'}} autoComplete="off"/>
                        </div>
                    </div>

                    <div id='interval' style={{width: '100%'}}>
                        <label htmlFor="">Intervalo de ano de nascimento para participação: <p className='ast'>*</p></label>
                        <div style={{width: '100%'}}>
                            <div style={{width: 'calc(50% - 5px)'}}>
                                <label>De:</label>
                                <input id="fromCategorie" type="text" inputMode="numeric" pattern="[0-9]" maxLength={4}/>
                            </div>
                            <div style={{width: 'calc(50% - 5px)'}}>
                                <label>Até:</label>
                                <input id="toCategorie" type="text" inputMode="numeric" pattern="[0-9]" maxLength={4}/>
                            </div>
                        </div>
                        {dateError != '' ? ( <p className="error">{dateError}</p> ) : ('')}
                    </div>

                    <div id='checkboxes' style={{width: '100%'}}>
                        <div>
                            <div>
                                <input id="fideCategorie" type="checkbox" />
                                <label  htmlFor="fide">Fide obrigatório</label>
                            </div>
                            <div>
                                <input id="cbxCategorie"  type="checkbox" />
                                <label htmlFor="cbx">CBX obrigatório</label>
                            </div>
                        
                        </div>
                        {hasDivision ? (
                            <div>
                                <div>
                                    <input id="superiorCategorie" type="checkbox"/>
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
                            <tbody>

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
                            </tbody>
                        </table>
                    ) : ('')}
                </div>
                <input name="categories" type="text" hidden value={JSON.stringify(categories)} />
            </div>
        </>
    )
}