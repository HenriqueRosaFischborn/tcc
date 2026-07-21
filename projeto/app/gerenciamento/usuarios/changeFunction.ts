'use server'

import db from "@/lib/db"


export async function changeFunction(email: string, funcao: boolean) {
    await db.usuario.update({
        where: {
            email: email
        },
        data: {
            admin: funcao
        }
    })
}