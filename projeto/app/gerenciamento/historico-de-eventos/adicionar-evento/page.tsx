'use client'

import './unique.css'
import './responsive.css'
import InputDate from '@/components/ui/input-date'

export default function AddEvent() {

    function divClick(e: React.MouseEvent) {
        const x = e.currentTarget.querySelector('input')
        if (!x) return
        x.checked = true
    }

    return (
        <>
            <div id='content'>
                <div className='form' style={{width: '100%'}}>
                    <h1 style={{width: '100%', textAlign: 'start'}}>ADICIONAR TORNEIO</h1>

                    <div style={{width: 'calc(50% - 15px)'}}>
                        <label htmlFor="title">Título</label>
                        <input type="text" name='title'/>
                    </div>
                    <div style={{width: 'calc(50% - 15px)'}}>
                        <label htmlFor="title">Data do Evento</label>
                        <InputDate />
                    </div>

                    <div style={{width: '100%'}}>
                        <label htmlFor="">Descrição:</label>
                        <textarea name="" id="description"></textarea>
                    </div>
                </div>
                <div id='gray-area'>
                    <div className='form' style={{justifyContent: 'end'}}>
                        <h2 style={{width: '100%', textAlign: 'start'}}>Adicionar categorias de premiação:</h2>

                        <div id='info' className='form'>
                            
                            <div style={{width: '100%'}}>
                                <label htmlFor="nameCat">Nome:</label>
                                <input type="text" />
                            </div>
                            <div style={{width: '100%', flexDirection: 'row', gap: '30px'}}>
                                <div style={{ flexDirection: 'row', gap: '10px', cursor: 'pointer'}} onClick={divClick}>
                                    <input type="radio" name="genre" /><label>Masculino</label>
                                </div>
                                <div style={{flexDirection: 'row', gap: '10px', cursor: 'pointer'}} onClick={divClick}>
                                    <input type="radio" name="genre" /><label>Feminino</label>
                                </div>
                            </div>
                        </div>

                        <div id='podium-inputs'>
                            <div>
                                <label htmlFor="first" style={{marginRight: '5px'}}>1° lugar:</label>
                                <input type="text" name='first'/>
                            </div>
                            <div>
                                <label htmlFor="second">2° lugar:</label>
                                <input type="text" name='second'/>
                            </div>
                            <div>
                                <label htmlFor="thirsd">3° lugar:</label>
                                <input type="text" name='thirsd'/>
                            </div>
                        </div>

                        <button className='button black'>Adicionar categoria</button>
                    </div>


                    <div id='body-tables'>
                        {Array.from({length: 3}).map((el, i) => {return (           
                            <div key={i} className='table-podium'>
                                <table>
                                    <thead>
                                        <tr><th colSpan={2} >Sub 14</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className='podium' >1°</td> <td>Henrique R. Fischborn</td></tr>
                                        <tr><td className='podium' >2°</td> <td>João P. Machado</td></tr>
                                        <tr><td className='podium' >3°</td> <td>Pedro M. Guimarães</td></tr>
                                    </tbody>
                                </table>
                                <button className='button black'>Remover</button>
                            </div>
                        )})}
                    </div>
                </div>

                <div id='upload-photo' style={{width: '100%'}}>
                    <h2>Foto principal:</h2>
                    <div style={{width: '100%'}}>
                        <button className='button red'><img src="/icons/upload.png" alt="" /> Anexar foto principal:</button>
                        <p className='obs'>
                            Tamanho recomendado: 2560 X 1440<br />
                            Haverá redimensionamento   
                        </p>
                    </div>
                </div>

                <button className='button red big'>Postar evento</button>
            </div>
        </>
    )
}