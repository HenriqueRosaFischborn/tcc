import './unique.css'
import './responsive.css'
import { getSupabaseAdmin } from '@/lib/supabase'
import db from '@/lib/db'
import classifyTime from '@/lib/classifyTime'


export default async function OpenTournments() {
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

    for (let i = 0 ; i < tournments.length ; i++) {
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

    function classifyTime(min: number, seg: number) {

        const total = min + seg

        if (total < 3) {
            return 'bullet'
        } else if (total < 10) {
            return 'blitz'
        } else if (total < 60) {
            return 'rapid'
        } else {
            return 'standard'
        }
    }


    return (
        <>
            <div id="tournaments">
                <h1>Torneios Abertos para Inscrição</h1>


                {tournments.length > 0 ? tournments.map((tournment, i) => {
                
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
                
                    const classTime = classifyTime(times.digital.time, times.digital.plus)
                    const classTime2 = classifyTime(times.analog.time, times.analog.plus)
                
                return(
                // i é o número de repetição do negócio
                <div className="tournament" key={i}>
                    <div className="content">
                    <h3>{tournment.title}</h3>
                    <div className="informations">
                        <p><span className="r">Data do encerramento das inscrições:</span> {dateInscri}</p>
                        <p><span className="r">Data do evento:</span> {dateEvent}</p>
                        <p>
                        <span>Tempo:</span> {diference ? (<>
                            Digital: {classTime.charAt(0).toUpperCase() + classTime.slice(1)} ({times.digital.time + ' + ' + times.digital.plus}) /
                            Analógico: {classTime2.charAt(0).toUpperCase() + classTime2.slice(1)} ({times.analog.time + ' + ' + times.analog.plus})
                        </>)
                            : `
                            ${classTime.charAt(0).toUpperCase() + classTime.slice(1)} (${times.digital.time + ' + ' + times.digital.plus})
                        `}
                        
                        &nbsp;&nbsp;&nbsp;
                        <span>Local: <a target='_blank' href={tournment.local_link ? tournment.local_link : '#'} className="link">{tournment.local}</a></span>
                        </p>
                    </div>
                    <a href={`/torneios-abertos/${tournment.title.split(' ').join('~')}`} className="button blue">Inscreva-se</a>
                    </div>
                    {folders[tournment.title.split(' ').join('~')] ? (
                        <img src={folders[tournment.title.split(' ').join('~')]} alt="torneio" fetchPriority='low' loading='lazy' decoding='async'/>
                    ) : ''}
                </div>
                )}) : (<>
                <p className="obs">Não há torneios abertos no momento</p>
                </>)}
            </div>
        </>
    )
}