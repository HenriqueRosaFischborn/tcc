'use client'

import './unique.css'
import './responsive.css'
import InputDate from '@/components/ui/input-date'

export default function AddTournment() {
    return (
        <>
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
                            <select name="timeAnalog" id="">
                                <option style={{display: 'none'}} value=""></option>
                                <option value="">3 + 5</option>
                                <option value="">15 + 3</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="timeDigital">Tempo digital:</label>
                            <select name="timeDigital" id="">
                                <option style={{display: 'none'}} value=""></option>
                                <option value="">3 + 5</option>
                                <option value="">15 + 3</option>
                            </select>
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
            <div id='gray-area'>
                <h2>Categoria:</h2>
                <div className='form' style={{width: 'calc(50% - 15px)'}}>
                    <h3>Adicionar categoria:</h3>
                    <div id='cat-basic' style={{width: '100%'}}>
                        <div>
                            <label htmlFor="catName">Nome:</label>
                            <input type="text" name='catName' style={{display: 'flex', flex: 1}}/>
                        </div>
                        <div>
                            <label htmlFor="catPrice">Valor:</label>
                            <input type="number" name='catPrice' style={{width: '30%'}}/>
                        </div>
                    </div>

                    <div id='interval' style={{width: '100%'}}>
                        <label htmlFor="">Intervalo de ano de nascimento para participação:</label>
                        <div style={{width: '100%'}}>
                            <div style={{width: 'calc(50% - 5px)'}}>
                                <label htmlFor="catYearMin">De:</label>
                                <input type="number" name='catYearMin'/>
                            </div>
                            <div style={{width: 'calc(50% - 5px)'}}>
                                <label htmlFor="catYearMin">Até:</label>
                                <input type="number" name='catYearMax'/>
                            </div>
                        </div>
                    </div>

                    <div id='checkboxes' style={{width: '100%'}}>
                        <div>
                            <div>
                                <input type="checkbox" name='fide'/>
                                <label htmlFor="fide">Fide obrigatório</label>
                            </div>
                            <div>
                                <input type="checkbox" name='cbx'/>
                                <label htmlFor="cbx">CBX obrigatório</label>
                            </div>
                        </div>
                        <div>
                            <div>
                                <input type="checkbox" name='fide'/>
                                <label htmlFor="fide">ESCOLAR</label>
                            </div>
                            <div>
                                <input type="checkbox" name='cbx'/>
                                <label htmlFor="cbx">SUPERIOR</label>
                            </div>
                        </div>
                    </div>

                    <button className='button black'>Adicionar categoria</button>
                </div>

                <div id='body-tables'>
                    <table>
                        <thead>
                            <tr><th>SEM DIVISÃO</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div>
                                        <p>Sub 14  - 15,00</p>
                                        <img src="/icons/cancel-red.png" alt="" />    
                                    </div>    
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table>
                        <thead>
                            <tr><th>ESCOLAR</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div>
                                        <p>Sub 14  - 15,00</p>
                                        <img src="/icons/cancel-red.png" alt="" />    
                                    </div>    
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table>
                        <thead>
                            <tr><th>SUPERIOR</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div>
                                        <p>Sub 14  - 15,00</p>
                                        <img src="/icons/cancel-red.png" alt="" />    
                                    </div>    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id='discount'>
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
                                    <img src="/icons/cancel-red.png" alt="" />  
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
                        <input type="number" name='email'/>
                    </div>
                    <button className='button black'>Adicionar email</button>
                </div>
                
                <table>
                    <thead>
                        <tr><th>Emails:</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className='td-width'>
                                    <p>teste@gmail.com</p>
                                    <img src="/icons/cancel-red.png" alt="" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
            </div>

            <div className='buttons'>
                <button className='button red'>Anexar folder</button>
                <button className='button red'>Anexar regulamento</button>

                <div style={{
                    widows: '100%',
                    justifyContent: 'end'
                }}>
                    <button className='button red big'>Adicionar torneio</button>
                </div>
            </div>
            
        </>
    )
}