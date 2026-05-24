'use server'

import db from "@/lib/db"



export async function getplayers(id: number) {
    const players = await db.incricao.findMany({
        where: {
            id_torneio: id
        },
        include: {
            categoria: {
                select: {
                    name: true,
                    uuid: true,
                    id_torneio: true
                }
            },
            divisoes: {
                select: {
                    name: true,
                    id: true
                }
            },
            usuario: {
                select: {
                    id: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    })
    
    return players
}

export async function getCategories(id: number) {
    const data = await db.categoria.findMany({
        where: {
            id_torneio: id
        },
        select: {
            uuid: true,
            name: true,
            default_division: true,
        }
    })
    return data
}

export async function getDivisons(id: number) {
    const data = await db.divisoes.findMany({
        where: {
            id_torneio: id
        },
        select: {
            id: true,
            name: true,
            isAbsolute: true
        }
    })
    return data
}