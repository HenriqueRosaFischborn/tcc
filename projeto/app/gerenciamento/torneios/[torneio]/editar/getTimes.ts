'use server'

import db from "@/lib/db"


export default async function getTimes() {
    const times = await db.tempo.findMany({
        select: {
            time: true,
            plus: true,
        },
        orderBy: [
            {
                time: 'asc'
            },
            {
                plus: 'asc'
            }
        ]
    })

    return times
} 