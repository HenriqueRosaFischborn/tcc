import './unique.css'
import './responsive.css'
import { getSupabaseAdmin } from '@/lib/supabase'
import db from '@/lib/db'
import Form from 'next/form'
import { deleteTournment } from './[torneio]/deletar-jogadores/action'
import DeleteButton from './[torneio]/deletar-jogadores/button'

type Tournment = {
    title: string,
    state: boolean,
    analogicTime: string,
    digitalTime : string,
    local: string,
    localLink: string,
    dateEvent: Date,
    dateInscri: Date,
    priceMin: number,
    priceMax: number,
    srcFolder: string
}


export default async function Tournments() {
    const tournments = await db.torneio.findMany(
        {
        // where: {id: 1},
        include: {
        tempo_torneio_time_digitalTotempo: {
            select: {
                time: true,
                plus: true
            }
        },
        tempo_torneio_time_analogTotempo: {
            select: {
                time: true,
                plus: true
            }
        }
        }}
    )

    const supabaseAdmin = await getSupabaseAdmin()  

    const folders: {[key: string]: string} = {}

     for (let i = 0; i < tournments.length; i++) {
    const pathFolder = `folders/${tournments[i].id}`;

    const { data, error } = await supabaseAdmin.storage
      .from("publics")
      .list("folders");

    if (!error && data.some(file => file.name === String(tournments[i].id))) {
      const publicUrl = supabaseAdmin.storage
        .from("publics")
        .getPublicUrl(pathFolder)
        .data.publicUrl;

      folders[tournments[i].title.split(" ").join("~")] = publicUrl;
    }
  }

    // function changeState(e: React.MouseEvent, el: Tournment) {
    //     const newState = el
    //     newState.state = !newState.state
    //     setTournments((prev) => prev.map((elPrev: Tournment) => elPrev == el ? newState : elPrev))
    // }
    
    return (
        <>
            <div id='content'>
                <div style={{justifyContent: 'space-between'}}>
                    <h1>Histórico de eventos</h1>
                    <a href="/gerenciamento/torneios/adicionar-torneio"><button className='button gray' style={{display: 'flex', alignItems: 'center', gap: '10px'}}><img src="/icons/plus.png" alt="plus" style={{
                        width: '26px',
                        height: 'auto',
                        objectFit: 'contain'
                    }}/> ADICIONAR TORNEIO</button></a> 
                </div>

                <div id='body'>
                    {tournments.map((tournment, i) => {
                        const dateInscri = tournment.date_inscri.toLocaleDateString('pt-BR')
                        const timeInscri = tournment.date_inscri.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    
                        const dateEvent = tournment.date_event.toLocaleDateString('pt-BR')
                        const timeEvent = tournment.date_event.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })

                        const times = {
                            digital: {
                                time: Number(tournment.tempo_torneio_time_digitalTotempo?.time),
                                plus: Number(tournment.tempo_torneio_time_digitalTotempo?.plus)
                            },
                            analog: {
                                time: Number(tournment.tempo_torneio_time_analogTotempo?.time),
                                plus: Number(tournment.tempo_torneio_time_analogTotempo?.plus)
                            }
                        }


                        return (
                        <div key={i} className='tournment'>
                            <div className='content'>
                                <div className='title'>
                                    <h2>{tournment.title}</h2>
                                </div>

                                {/* <div className='state'>
                                    <p>Estado: </p>
                                    <Switch colorOn='#229614' colorOff='var(--darkgray)' el={el} onClick={changeState} defaultChecked={el.state}/>
                                    {el.state ? (
                                        <p style={{color: '#229614'}}>Ativo </p>
                                    ) : (
                                        <p style={{color: '#6b6b6bff'}}>Inativo </p>
                                    )}
                                </div> */}
                                <div className='body-informations'>
                                    <div className='informations'>
                                        <p>Tempos: {times.digital.time + ' + ' + times.digital.plus} (digital) / {times.analog.time + ' + ' + times.analog.plus} (analógico)</p>
                                        <a href={tournment.local_link ? tournment.local_link : '#'}>Local: {tournment.local}</a>
                                        {/* <p>Valor: {tournment.priceMin} - {tournment.priceMax}</p> */}
                                    </div>
                                    <div className='informations'>
                                        <p>Encerramento das inscrições:</p>
                                        <p>Data: {dateInscri}</p>
                                        <p>Hora: {timeInscri}</p>
                                    </div>
                                    <div className='informations'>
                                        <p>Início:</p>
                                        <p>Data: {dateEvent}</p>
                                        <p>Hora: {timeEvent}</p>
                                    </div>
                                </div>
                            </div>
                            {folders[tournment.title.split(' ').join('~')] ? (
                                <img src={folders[tournment.title.split(' ').join('~')]} alt="img" className='tournment-img' fetchPriority='low' loading='lazy' decoding='async'/>
                            ) : ''}
                            
                            <div className='buttons'>
                                <a href={`/gerenciamento/torneios/${tournment.title.split(' ').join('~')}/editar`} className='button red'>Editar informações</a>
                                
                                <DeleteButton id={Number(tournment.id) }/>
                                
                                <a href={`/gerenciamento/torneios/${tournment.title.split(' ').join('~')}/analisar-jogadores`} className='button gray'>Analisar jogadores inscritos</a>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </>
    )
}