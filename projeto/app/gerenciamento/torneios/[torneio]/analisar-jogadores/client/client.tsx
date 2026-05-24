'use client'

// Crtl + alt + j vai pro próximo bookmark e ctrl + alt + k adiciona ou tira

import { Cat, Div, Player } from '@/lib/types'
import { useEffect, useState } from 'react'

type Inscricoes = {
    [key: string]: Player
}

export default function BodyClient({players, comprovantes, categories, divisions}: {categories: Cat[], divisions: Div[], players: Player[], comprovantes: {[key: string]: string}}) {


    const [defaultInscri, setDefaultInscri] = useState<Inscricoes>({})
    const [nowInscri, setNowInscri] = useState<Inscricoes>({})

    useEffect(() => {
        console.log(nowInscri)
        console.log(defaultInscri)
    }, [nowInscri])
    
    useEffect(() => {
        const dataInscri: Inscricoes = {}
        players.map((el) => {
            dataInscri[el.uuid] = el
        })
        setDefaultInscri(dataInscri)
        setNowInscri(dataInscri)
    }, [])
    
    function updateObjNowSelect(uuid: string, collumn: string, value: string, type: string) {

        setNowInscri(prev => {
            const newValue = type === 'string' ? value : BigInt(value)

            const updatedPlayer = {
                ...prev[uuid],
                [collumn]: newValue
            }

            // caso esteja mudando divisão
            if (type === 'division') {
                const validCats = categories.filter(cat =>Number(cat.default_division) === Number(value)).map(cat => cat.uuid)

                const currentCat = prev[uuid].uuid_cat

                const division = divisions.find(d => Number(d.id) === Number(value))

                const stillValid = validCats.includes(currentCat)

                // se não for absoluta e categoria inválida
                if (!division?.isAbsolute && !stillValid) {
                    updatedPlayer.uuid_cat = validCats[0] ?? ''
                }
            }

            return {
                ...prev,
                [uuid]: updatedPlayer
            }
        })
    }
    
    return (
        <>
            
                <div id='downloads'>
                    <h2>Baixar lista de jogadores:</h2>
                    <div className='buttons'>
                        <button className='button gray'><img src="/icons/download.png" alt="" fetchPriority='low' loading='lazy' decoding='async'/> PDF</button>
                        <button className='button gray'><img src="/icons/download.png" alt="" fetchPriority='low' loading='lazy' decoding='async'/> Swiss Manager (.xls)</button>
                    </div>
                </div>

                <div id='players'>
                    <h2>Jogadores inscritos:</h2>
                    {/* <div id='div-search-bar'>
                        <input type="text" />
                        <div id='icon-search'>
                            <img src="/icons/search.png" alt="search" fetchPriority='low' loading='lazy' decoding='async'/>
                        </div>
                    </div> */}
                    <div id='table'>
                        <table>
                            <thead>
                                <tr>
                                    {/* <th ></th> */}
                                    <th>Status:</th>
                                    <th>Nome:</th>
                                    <th>Comprovante:</th>
                                    <th>ID FIDE:</th>
                                    <th>ID CBX:</th>
                                    <th>Cidade:</th>
                                    <th>Clube:</th>
                                    <th>Rating FIDE:</th>
                                    <th>Rating CBX:</th>
                                    <th>Data de nascimento:</th>
                                    <th>Divisão:</th>
                                    <th>Categoria:</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(nowInscri).map((el, i) => {return (
                                    <tr key={i}>
                                        {/* <td className='input-user' style={{cursor: 'pointer'}} onClick={(e) => {
                                            if (!(e.target instanceof HTMLElement)) return
                                            if (e.target.className == 'input-user') {
                                                const input = e.currentTarget.querySelector('input')
        
                                                if (!(input instanceof HTMLElement)) return
            
                                                input.click()
                                            }
                                        }}>
                                            <div style={{
                                                width: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <input type='checkbox' />
                                            </div>
                                        </td>   */}
                                        <td className='select' style={{backgroundColor: nowInscri[el.uuid]?.status !== defaultInscri[el.uuid]?.status ? 'var(--ligthgray)' : '', color: nowInscri[el.uuid]?.status == 'Confirmada' ? '#0F7B0F' : nowInscri[el.uuid]?.status == 'Recusada' ? 'red' : 'var(--mainblack)'}}>
                                            <select name="" id="" defaultValue={el.status} onChange={(e) => updateObjNowSelect(el.uuid, 'status', e.currentTarget.value, 'string')}>
                                                <option style={{color: 'green'}} value="Confirmada">Confirmada</option>
                                                <option style={{color: 'var(--mainblack)'}} value="Pendente">Pendente</option>
                                                <option style={{color: 'red'}} value="Recusada">Recusada</option>
                                            </select>
                                        </td>
                                        <td>{el.name}</td>  
                                        <td><a href={comprovantes[el.uuid]} target='_blank'>Ver comprovante</a></td>
                                        <td>{el.id_fide}</td> 
                                        <td>{el.id_cbx}</td>
                                        <td>{el.city}</td>
                                        <td>{el.club ? el.club : 'Nenhum'}</td>
                                        <td>{el.rtg_fide}</td>
                                        <td>{el.rtg_cbx}</td>
                                        <td>{el.data_nasc.toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                        <td className='select' style={{backgroundColor: nowInscri[el.uuid]?.id_division !== defaultInscri[el.uuid]?.id_division ? 'var(--ligthgray)' : ''}}>
                                            <select name="" id="" defaultValue={Number(el.divisoes.id)} onChange={(e) => {updateObjNowSelect(el.uuid, 'id_division', e.currentTarget.value, 'division')}}>
                                                {divisions.map((div, i2) => (
                                                    <option key={i2} value={Number(div.id)}>{div.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className='select' style={{backgroundColor: nowInscri[el.uuid].uuid_cat !== defaultInscri[el.uuid]?.uuid_cat ? 'var(--ligthgray)' : ''}}>
                                            <select name="" className='categorias' value={nowInscri[el.uuid].uuid_cat} onChange={(e) => updateObjNowSelect(el.uuid, 'uuid_cat', e.currentTarget.value, 'string')}>
                                                {categories.filter((cat, i2) => {
                                                    if ((cat.default_division == nowInscri[el.uuid].id_division) || (divisions.filter((d) => d.id == nowInscri[el.uuid].id_division)[0].isAbsolute && cat.uuid == nowInscri[el.uuid].uuid_cat)) {
                                                        return true
                                                    }
                                                }).map((cat, i2) => (
                                                    <option key={i2} value={cat.uuid}>{cat.name} ({divisions.find(d => Number(d.id) === Number(cat.default_division))?.name})</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                    <button id='save-changes' className={`button red ${false ? '' : 'disableDiv'}`}>Salvar Alterações</button>
                </div>
        </>
    )
}