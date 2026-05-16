'use server'

import { auth } from "@/auth"
import db from "@/lib/db"
import { FormState } from "@/lib/types"
import * as cheerio from 'cheerio'



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
        }
    })

    if (!cat) {
        return {
            message: ['erro'],
            values: [resData]
        }
    }

    const year = Number(resData.borndate.split('/').at(-1))
    
    if (!(year >= cat.min_y && year <= cat.max_y)) {
        console.log('erro aqui')
        return{
            message: ['erro'],
            values: [resData]
        }
    }

    const emptyFields = dataArray.filter((el) => {
        if (needed.includes(el[0]) && el[1].trim() == '') {
            return true
        }
    })
    if (emptyFields.length > 0) {return {message: ['erro']}}


    if (resData.idfide.trim() != '') {
        console.log('começamo')
        const res = await fetch(`https://ratings.fide.com/profile/${resData.idfide}`, {
            cache: 'force-cache',
            next: { revalidate: 60 * 60 }
        })

        const html = await res.text()
        
        const $ = cheerio.load(html)
        const playerName = $('.player-title').text().trim()
        const year = $('.profile-info-byear').text().trim()
        const sex = $('.profile-info-sex').text().trim()

        
        // const ratingsT = $('.profile-games').text().trim()
        // const regex = /(\d+|Not rated)(BLITZ|STANDARD|RAPID)/g
        // const ratings = [...ratingsT.matchAll(regex)].map(match => ({
        //     rating: String(match[1]),
        //     type: String(match[2])
        // }))
        
        if (resData.borndate.split('/').at(-1) != year) {
            console.log('Erro de data')
            return {
                message: ['error-info-id'],
                values: [resData]
            }
        }
        if ((resData.genre == 'fem' && sex == 'Male') || (resData.genre == 'masc' && sex == 'Female')) {
            console.log('Erro de sexo')
            return {
                message: ['error-info-id'],
                values: [resData]
            }
        }
        if (resData.name != playerName) {
            console.log('Erro de nome')
            return {
                message: ['error-info-id'],
                values: [resData]
            }
        }

        const alreadyExists = await db.incricao.findFirst({
            where: {
                id_fide: Number(resData.idfide),
                id_torneio: cat.id_torneio
            }
        })

        if (alreadyExists) {
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
    

    try {
        const res = await db.incricao.create({
            data: {
                uuid_cat: cat.uuid,
                id_usuario: user.id,
                city: resData.city,
                club: resData.team,
                data_nasc: date,
                id_fide: resData.idfide.trim() == '' ? undefined : Number(resData.idfide),
                id_cbx: resData.idcbx.trim() == '' ? undefined : Number(resData.idcbx),
                genre: resData.genre == 'masc',
                name: resData.name,
                division: resData.division ? resData.division == 'escolar' ? 'escolar' : 'superior' : 'sem',
                id_torneio: Number(cat.id_torneio)
            }


        })
        
        return {
            message: ['Sucesso', `/minhas-inscricoes/${res.uuid}`],
            values: [resData]
        }
    } catch {
        return {message: ['erro']}
    }
    
    return {
        message: ['erro'],
        values: [resData]
    }
}