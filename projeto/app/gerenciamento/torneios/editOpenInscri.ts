'use server'

import db from "@/lib/db"

export async function closeInscri(id: number) {
    await db.torneio.update({
        where: {
            id: id
        },
        data: {
            inscri_closed_by_arbiter: true
        }
    })
}

export async function openInscri(id: number) {
    await db.torneio.update({
        where: {
            id: id
        },
        data: {
            inscri_closed_by_arbiter: false
        }
    })
}