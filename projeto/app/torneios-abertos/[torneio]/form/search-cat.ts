'use server'

import { division } from "@/generated/prisma/enums"
import db from "@/lib/db"



export default async function searchCat(date: string) {
    const year = Number(date.split('/')[2])

    if (!year) {
        return {
            message: 'data inválida',
        }
    }

    const cat = await db.categoria.findFirst({
        where : {
            OR: [
                {
                    min_y: {
                        lte: year
                    },
                    max_y: {
                        gte: year
                    }
                },
                {
                    min_y: {
                        gt: year
                    }
                }
            ]
        },
        orderBy: {
            min_y: 'asc' 
        }
    })

    if (cat) {
        return {
            message: 'Sucesso',
            uuidCat: cat.uuid,
            name: cat.name,
            value: cat.value,
            division: cat.has_division,
            fide: cat.fide,
            cbx: cat.cbx
        }
    } else {
        return {
            error: true
        }
    }
}