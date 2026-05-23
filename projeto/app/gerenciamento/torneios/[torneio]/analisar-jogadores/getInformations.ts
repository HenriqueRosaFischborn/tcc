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
                    name: true
                }
            },
            divisoes: {
                select: {
                    name: true
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

    console.log(players)
    
    return players
}