'use server'

import { sendRequestedMessageEmail } from "@/app/api/email/inscription-solicited/send"
import { sendNewInscription } from "@/app/api/email/new-inscription/send"
import { auth } from "@/auth"
import classifyTime from "@/lib/classifyTime"
import db from "@/lib/db"
import { getSupabaseAdmin } from "@/lib/supabase"
import { FormState } from "@/lib/types"
import * as cheerio from 'cheerio'

type DataPlayer = {
    name: string,
    bornYear: string,
    genre: string,
    title: string,
    sigla: string,
    idFide: string,
    ratings: {
        standard: string,
        rapid: string,
        blitz: string
    }
}

export default async function actionInscriIndividual(prev: FormState, formdata: FormData): Promise<FormState> {
    const needed = ['name', 'city', 'borndate', 'genre', 'uuidCat']
    
    const data = Object.fromEntries(formdata) as Record<string, string>
    const dataArray = Object.entries(data).filter((el) => {
        if (!(el[0].startsWith('$'))) {
            return true
        }
    })
    const resData = Object.fromEntries(dataArray)

    const cat = await db.categoria.findFirst({
        where: {
            uuid: resData.uuidCat
        }, include: {
            torneio: {
                select: {
                    title: true,
                
                    tempo_torneio_time_digitalTotempo: {
                        select: {
                            time: true,
                            plus: true
                        }
                    }
                }
            }
        }
        
    })

    if (!cat) {
        return {
            message: ['erro'],
            values: [resData]
        }
    }

    const year = Number(resData.borndate.split('/').at(-1))
    
    // if (!(year >= cat.min_y && year <= cat.max_y)) {
    //     console.log('erro aqui')
    //     return{
    //         message: ['erro'],
    //         values: [resData]
    //     }
    // }

    const emptyFields = dataArray.filter((el) => {
        if (needed.includes(el[0]) && el[1].trim() == '') {
            return true
        }
    })
    if (emptyFields.length > 0) {return {message: ['erro']}}


    //if (resData.idfide.trim() != '') {
        // console.log('começamo')
        // const res = await fetch(`https://ratings.fide.com/profile/${resData.idfide}`, {
        //     cache: 'force-cache',
        //     next: { revalidate: 60 * 60 }
        // })

        // const html = await res.text()
        
        // const $ = cheerio.load(html)
        // const playerName = $('.player-title').text().trim()
        // const year = $('.profile-info-byear').text().trim()
        // const sex = $('.profile-info-sex').text().trim()

        
        // const ratingsT = $('.profile-games').text().trim()
        // const regex = /(\d+|Not rated)(BLITZ|STANDARD|RAPID)/g
        // const ratings = [...ratingsT.matchAll(regex)].map(match => ({
        //     rating: String(match[1]),
        //     type: String(match[2])
        // }))
        
        // if (resData.borndate.split('/').at(-1) != year) {
        //     console.log('Erro de data')
        //     return {
        //         message: ['error-info-id'],
        //         values: [resData]
        //     }
        // }
        // if ((resData.genre == 'fem' && sex == 'Male') || (resData.genre == 'masc' && sex == 'Female')) {
        //     console.log('Erro de sexo')
        //     return {
        //         message: ['error-info-id'],
        //         values: [resData]
        //     }
        // }
        // if (resData.name != playerName) {
        //     console.log('Erro de nome')
        //     return {
        //         message: ['error-info-id'],
        //         values: [resData]
        //     }
        // }

        
    //}
    const hasFide = formdata.get('hasFide')
    if (hasFide == 'true') {
        const alreadyExists = await db.incricao.findFirst({
            where: {
                id_fide: Number(resData.idfide),
                id_torneio: cat.id_torneio
            }
        })


        if (alreadyExists) {
            console.log('Já inscrito')
            return {
                message: ['Você já está inscrito'],
                values: [resData]
            }
        }
    }

    const session = await auth()
    const email = session?.user.email

    if (!session || !session.user.email) {
        return {message: ['não logado']}
    }
    
    const user = await db.usuario.findUnique({
        where: {email: email}
    })

    if (!user) {
        return {message: ['erro']}
    }
    
    
    const [d, m, y] = resData.borndate.split('/').map(Number)
    const date = new Date(y, m - 1, d)







    
    //id divisão
    const clientDivision = formdata.get('division')

    const divisions = await db.divisoes.findMany({
        where: {
            id_torneio: cat.id_torneio
        }
    })
    
    let defaultDivision
    
    defaultDivision = divisions.filter((el) => {
        if (el.id == cat.default_division) {
            return true
        }
    })[0]

    let absoluteDivision
    if (divisions.some((el) => {
        if (el.isAbsolute) {
            console.log(el)
            return true
        }
    })) {
        absoluteDivision = divisions.filter((el) => {
            if (el.isAbsolute) {
                return true
            }
        })[0]

        if (absoluteDivision.name == clientDivision) {
            defaultDivision = absoluteDivision
        }
    }

    const classTime = await classifyTime(Number(cat.torneio.tempo_torneio_time_digitalTotempo?.time), Number(cat.torneio.tempo_torneio_time_digitalTotempo?.plus))

    const playerFide = JSON.parse(String(formdata.get('playerFide'))) as DataPlayer
    const playerCbx = JSON.parse(String(formdata.get('playerCbx'))) as DataPlayer

    try {
        const res = await db.incricao.create({
            data: {
                uuid_cat: cat.uuid,
                id_usuario: user.id,
                city: resData.city,
                club: resData.team,
                data_nasc: date,
                id_division: defaultDivision.id,
                id_fide: String(resData.idfide).trim() == '' ? null : Number(resData.idfide),
                id_cbx: String(resData.idcbx).trim() == '' ? null : Number(resData.idcbx),
                genre: resData.genre == 'masc',
                name: hasFide && playerFide? playerFide.name : resData.name,
                id_torneio: Number(cat.id_torneio),
                federation: playerFide ? playerFide.sigla : undefined,
                titulo: playerFide && playerFide.title != 'None' ? playerFide.title : undefined,
                rtg_fide: classTime == 'bullet' ? null : (playerFide ? playerFide.ratings[classTime] == 'Not rated' ? 0 : Number(playerFide.ratings[classTime]) : null),
                rtg_cbx: classTime == 'bullet' ? null :  (playerCbx ? playerCbx.ratings[classTime] == 'Not rated' ? 0 : Number(playerCbx.ratings[classTime]): null)
            }
        })
//erro aqui
        
        const fileComprovante = formdata.get('fileComprovante') as File
        const fileComprovantePath = fileComprovante.size != 0 ? `comprovantes/${cat.id_torneio}/${user.id}/${res.uuid}` : ''
        if (fileComprovante.size != 0) {
            
            const supabaseAdmin = await getSupabaseAdmin()
            const {error} = await supabaseAdmin.storage.from('publics').upload(fileComprovantePath, fileComprovante, {
                upsert: true,
                contentType: fileComprovante.type
            })
        }


        const obj = {
            uuid: res.uuid,
            city: res.city,
            club: res.club ? res.club : '',
            genre: res.genre,
            data_nasc: res.data_nasc,
            id_fide: res.id_fide ? Number(res.id_fide) : 0,
            id_cbx: res.id_cbx ? Number(res.id_cbx) : 0,
            uuid_cat: res.uuid_cat,
            status: res.status,
            id_usuario: res.id_usuario,
            name: res.name,
            id_division: res.id_division ? Number(res.id_division) : 0,
            id_torneio: res.id_torneio ? Number(res.id_torneio) : 0,
            rtg_fide: res.rtg_fide ? Number(res.rtg_fide) : 0,
            rtg_cbx: res.rtg_cbx ? Number(res.rtg_cbx) : 0,
            federation: res.federation ?? undefined,
            titulo: res.titulo ?? undefined,
            categoria: {
                name: cat.name,
                uuid: cat.uuid,
                id_torneio: Number(cat.id_torneio),
                min_y: cat.min_y,
            },
            divisoes: {
                name: defaultDivision.name,
                id: Number(defaultDivision.id),
            },
            usuario: {
                id: user.id,
                email: user.email,
            },
            }
        
        await sendNewInscription(obj, cat.torneio.title, Number(cat.id_torneio))
        await sendRequestedMessageEmail(obj, cat.torneio.title)


        return {
            message: ['Sucesso', `/minhas-inscricoes/`],
            values: [resData]
        }
    } catch (e){
        throw e
        console.log('errin')
        return {message: ['erro']}
    }

    
    
}

//comprovant