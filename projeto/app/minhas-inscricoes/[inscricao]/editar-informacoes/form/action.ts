'use server'

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

    const uuid = String(formdata.get('uuid'))
    try {
        const res = await db.incricao.update({
            where: {
                uuid: uuid
            },
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