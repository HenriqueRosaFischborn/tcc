'use client'

import InputDate from '@/components/ui/input-date'
import Form from 'next/form'
import { useActionState, useState } from 'react'
import addTournmentForm from './action'
import CategorieArea from './categories/catArea'
import { NewTournment } from '@/lib/types'
import { verifyEmail } from '@/app/(auth)/cadastro/form/verify-types'

export default function AddTournmentForm({times}: {times?: {time: number, plus: number}[]}) {
    const initialValue: NewTournment = {}
    const [state, formAction] = useActionState(addTournmentForm, initialValue)

    const [emails, setEmails] = useState<string[]>(['testezin@gmail.com', 'testezin2@gmail.com', 'testezin3@gmail.com'])
    const [emailError, setEmailError] = useState<string>('')

    function removeEmail(index: number) {
        setEmails(prev => prev.filter((el, i) => i != index))
    }

    const [fileFolder, setFileFolder] = useState<string>('')
    const [fileReg, setFileReg] = useState<string>('')

    async function giveEmail() {
        const input = document.querySelector('#input-email')

        if (!(input instanceof HTMLInputElement)) return

        const value = input.value

        const x = await verifyEmail(value)

        if (value.trim() == '' || !x) {
            setEmailError('Este não é um email válido')
        } else {
            if (emails.includes(value)) {
                setEmailError('Este email já está cadastrado')
            } else {
                setEmailError('')
                setEmails(prev => [...prev, value])
                input.value = ''
            }        
        }
    }
    
    return (
        <>
            <Form action={formAction}>

                <div id='content'>
                    <div className='form' style={{width: '100%'}}>
                    <h1>Adicionar torneio</h1>
                        <div style={{width: 'calc(50% - 15px)'}}>
                            <label htmlFor="title">Título:</label>
                            <input type="text" name='title'/>
                        </div>
                        <div id='times' style={{width: 'calc(50% - 15px)'}}>
                            <div>
                                <label htmlFor="timeAnalog">Tempo analógico:</label>
                                {times ? (
                                    <select name="timeAnalog" id="">  
                                        <option style={{display: 'none'}} value=""></option>
                                        {times.map((el, i) => {
                                            return (
                                                <option key={i} value={`${el.time}+${el.plus}`} >{el.time} + {el.plus}</option>
                                            )
                                        })}
                                    </select>
                                ) : (
                                    <input style={{flex: 1}} type="text" value={'Não há tempos cadastrados'} readOnly/>
                                )}
                            </div>
                            <div>
                                <label htmlFor="timeDigital">Tempo digital:</label>
                                {times ? (
                                    <select name="timeAnalog" id="">  
                                        <option style={{display: 'none'}} value=""></option>
                                        {times.map((el, i) => {
                                            return (
                                                <option key={i} value={`${el.time}+${el.plus}`} >{el.time} + {el.plus}</option>
                                            )
                                        })}
                                    </select>
                                ) : (
                                    <input style={{flex: 1}} type="text" value={'Não há tempos cadastrados'} readOnly/>
                                )}
                            </div>
                        </div>

                        <div style={{width: '100%'}} id='local'>
                            <div>
                                <label htmlFor="local">Local:</label>
                                <input type="text" name='local'/>
                            </div>
                            <div>
                                <label htmlFor="localLink">Link do local (google maps):</label>
                                <input type="text" name='localLink'/>
                            </div>
                        </div>

                        <div style={{width: '35%'}}>
                            <label >Data do evento:</label>
                            <InputDate />
                        </div>
                        <div style={{width: '35%'}}>
                            <label htmlFor="hour">Hora:</label>
                            <input type="text" name='hour'/>
                        </div>
                        <div style={{width: '35%'}}>
                            <label >Data do evento:</label>
                            <InputDate />
                        </div>
                        <div style={{width: '35%'}}>
                            <label htmlFor="hour">Hora:</label>
                            <input type="text" name='hour'/>
                        </div>
                    </div>
                </div>
                
                <CategorieArea />

                <div id='discount' className='content'>
                    <h3>Descontos:</h3>
                    <div className='form' style={{width: 'calc(50% - 15px)'}}>
                        <div style={{width: 'calc(50% - 15px)'}}>
                            <label htmlFor="disNumPlayers">Número de jogadores para desconto:</label>
                            <input type="number" name='disNumPlayers'/>
                        </div>
                        <div style={{width: 'calc(50% - 15px)'}}>
                            <label htmlFor="disPrice">Valor (%):</label>
                            <input type="number" name='disPrice'/>
                        </div>
                        <button className='button black'>Adicionar desconto</button>
                    </div>
                    
                    <table>
                        <thead>
                            <tr><th>Descontos:</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className='td-width'>
                                        <p>10% para 10 jogadores</p>
                                        <img src="/icons/cancel-red.png" alt="" fetchPriority='low' loading='lazy' decoding='async'/>  
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                

                <div id='emails'>
                    <h3>Emails de envio da lista de jogadores:</h3>
                    <div className='form' style={{width: 'calc(50% - 15px)'}}>
                        <div  style={{width: '100%'}}>
                            <label htmlFor="email">Email:</label>
                            <input id='input-email' type="text" name='email'/>
                            {emailError != '' ? (
                                <p className='error'>{emailError}</p>
                            ) : ('')}
                        </div>
                        <button onClick={() => giveEmail()} type='button' className='button black'>Adicionar email</button>
                    </div>
                    
                    {emails.length > 0 ? (
                        <table>
                            <thead>
                                <tr><th>Emails:</th></tr>
                            </thead>
                            <tbody>
                                {emails.map((el, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <div className='td-width'>
                                                    <p>{el}</p>
                                                    <img onClick={(e) => {
                                                        
                                                        if (!(e.currentTarget.parentElement?.firstChild instanceof HTMLElement)) return
                                                        removeEmail(i)
                                                    }} style={{cursor: 'pointer'}} src="/icons/cancel-red.png" alt="" />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : ('')}
                    
                </div>

                <div className='buttons'>
                    <button className='button red'>Anexar folder</button>
                    <button className='button red'>Anexar regulamento</button>
                    <input type='file' hidden={true} onChange={(e) => console.log(e.currentTarget.value)}/>
                    <input type='file' hidden={true} onChange={(e) => console.log(e.currentTarget.value)}/>

                    <div style={{
                        widows: '100%',
                        justifyContent: 'end',
                        flexDirection: 'row',
                        
                    }}>
                        <button type='submit' className='button red big'>Adicionar torneio</button>
                    </div>
                </div>
            </Form> 
        </>
    )
}