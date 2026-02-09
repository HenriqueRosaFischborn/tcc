'use client'


export default function CategorieArea() {
    return (
        <>
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
                                <input type="radio" defaultChecked={true} name='division'/>
                                <label htmlFor="fide">SEM DIVISÃO</label>
                            </div>
                            <div>
                                <input type="radio" name='division'/>
                                <label htmlFor="cbx">ESCOLAR</label>
                            </div>
                            <div>
                                <input type="radio" name='division'/>
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
                                        <img src="/icons/cancel-red.png" alt="" fetchPriority='low' loading='lazy' decoding='async'/>    
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
                                        <img src="/icons/cancel-red.png" alt="" fetchPriority='low' loading='lazy' decoding='async'/>    
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
                                        <img src="/icons/cancel-red.png" alt="" fetchPriority='low' loading='lazy' decoding='async'/>    
                                    </div>    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}