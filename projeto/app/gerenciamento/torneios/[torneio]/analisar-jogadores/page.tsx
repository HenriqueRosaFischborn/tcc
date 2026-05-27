import { redirect } from "next/navigation";
import BodyClient from "./client/client";
import redirectTournment from "@/app/torneios-abertos/[torneio]/redirect";
import { getSupabaseAdmin } from "@/lib/supabase";
import './unique.css'
import './responsive.css'
import classifyTime from "@/lib/classifyTime";
import {getCategories, getDivisons, getplayers} from "./getInformations";
import { Cat, Div, Player } from "@/lib/types";

export default async function Players({params}: {params: Promise<{ torneio: string }>}) {
    const {torneio} = await params
    
    const tournment = await redirectTournment(torneio)
    if (!tournment) {
        redirect('/torneios-abertos')
    }

    const supabaseAdmin = await getSupabaseAdmin()  

    const pathReg = `regulamentos/${torneio.split('~').join(' ')}`
    const dataReg = supabaseAdmin.storage.from('publics').getPublicUrl(pathReg).data
    const reg = dataReg.publicUrl

    const pathFolder = `folders/${torneio.split('~').join(' ')}`
    const dataFolder = supabaseAdmin.storage.from('publics').getPublicUrl(pathFolder).data
    const folder = dataFolder.publicUrl

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
    const diference = times.digital.time + ' + ' + times.digital.plus != times.analog.time + ' + ' + times.analog.plus

    const classTime = await classifyTime(times.digital.time, times.digital.plus)
    const classTime2 = await classifyTime(times.analog.time, times.analog.plus)

    const inscricoes = await getplayers(Number(tournment.id)) as Player[]

    const comprovantes: { [key: string]: string } = {}
    inscricoes.map((el)=> {
        const pathComprovante = `comprovantes/${torneio.split('~').join(' ')}/${el.usuario.id}/${el.uuid}`
        const dataComprovante = supabaseAdmin.storage.from('publics').getPublicUrl(pathComprovante).data
        const comprovante = dataComprovante.publicUrl
        comprovantes[el.uuid] = comprovante
    })

    const categories = await getCategories(Number(tournment.id)) as Cat[]
    const diviisons = await getDivisons(Number(tournment.id)) as Div[]
    
    return (
        <>
            <div id='content'>

                <h1>Analisar jogadores: {tournment.title}</h1>
                <div id='info'>
                    <div className="texts">
                        <p className='informations'>
                            {reg ? 
                                (<>
                                    <a href={reg} className="link" target='_blank' rel="noopener noreferrer">Ver regulamento</a><br /><br />
                                </> )
                            : ''}
                            
                            Tempo: 
                            {diference ? (<>
                                <br />
                                Digital: {classTime.charAt(0).toUpperCase() + classTime.slice(1)} ({times.digital.time + ' + ' + times.digital.plus}) <br />
                                Analógico: {classTime2.charAt(0).toUpperCase() + classTime2.slice(1)} ({times.analog.time + ' + ' + times.analog.plus}) <br />
                            </>)
                                : `
                                ${classTime.charAt(0).toUpperCase() + classTime.slice(1)} (${times.digital.time + ' + ' + times.digital.plus})
                            `}<br />

                            Local: <a className='link' target='_blank' href={tournment.local_link ? tournment.local_link : '#'}>{tournment.local}</a><br />
                        </p>
                        <p className='informations'>
                            Encerramento das inscrições: <br />
                            Data: {dateInscri}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hora:  {timeInscri} <br />
                            <br />
                            Início: <br />
                            Data: {dateEvent}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hora: {timeEvent}<br />
                            <br />
                            {tournment.link_chessresults ? (<>
                                Chessresults:  <a className='link' target='_blank' href={tournment.link_chessresults}>Clique aqui</a><br />
                            </>) : ''} 
                        </p>
                    </div>
                    
                    {folder ? <img id='folder-img' src={folder} alt="folder" fetchPriority='low' loading='lazy' decoding='async'/> : ''}
                </div>
           
                <BodyClient nameTournment={tournment.title} categories={categories} divisions={diviisons} comprovantes={comprovantes} players={inscricoes}/>
            </div>
        </>
    )
}