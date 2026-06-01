'use server'

import { division } from "@/generated/prisma/enums"
import db from "@/lib/db"



export default async function searchCat(date: string, genre: string) {
    

    const year = Number(date.split('/')[2])

    if (!year) {
        return {
            message: 'data inválida',
        }
    }



    let cat2 = await db.categoria.findMany({
        where: {
            min_y: {
                lte: year
            },
            max_y: {
                gte: year
            }
        }, include: {divisoes: {select: {genre: true}}}
    })
    
    if (cat2.length == 0) {
        cat2 = await db.categoria.findMany({
            where: {
                max_y: {
                    lt: year
                }
            },
            orderBy: {
                max_y: 'desc'
            }, include: {divisoes: {select: {genre: true}}}
        })
    }

    if (cat2.length == 0) {
        cat2 = await db.categoria.findMany({
            where: {
                min_y: {
                    gt: year
                }
            },
            orderBy: {
                min_y: 'asc'
            }, include: {divisoes: {select: {genre: true}}}
        })
    }


    const categorie = cat2.filter((el) => {
        if (el.divisoes.genre == genre.toLowerCase() || el.divisoes.genre == 'ambos') {
            return true
        }
    })[0]
    
    console.log(categorie)
    const divisions = await db.divisoes.findMany({
        where: {
            id_torneio: categorie.id_torneio
        }
    })
    
    
    let defaultDivision
    let absoluteDivision
    if (divisions.some((el) => {
        if (el.isAbsolute) {
            console.log(el)
            return true
        }
    })) {
        defaultDivision = divisions.filter((el) => {
            if (el.id == categorie.default_division) {
                return true
            }
        })[0]

        absoluteDivision = divisions.filter((el) => {
            if (el.isAbsolute) {
                return true
            }
        })[0]


    }


    if (categorie) {
        return {
            message: 'Sucesso',
            uuidCat: categorie.uuid,
            name: categorie.name,
            value: categorie.value,
            default_division: defaultDivision?.name,
            absolute_division: absoluteDivision?.name
        }
    } else {
        return {
            error: true
        }
    }
}