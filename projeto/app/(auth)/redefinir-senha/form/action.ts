'use server'

import db from "@/lib/db"
import { FormState } from "@/lib/types"
import crypto from 'crypto'
import  *  as  argon2  from  "argon2"


export default async function resetPasswordAction(prevSate: FormState, formdata: FormData): Promise<FormState> {
    let error = false
    const message = []
    
    const data = Object.fromEntries(formdata) as Record<string, string>

    const dataArray = Object.entries(data).filter((el) => {
        if (el[0].split('')[0] !== '$') {
            return true
        }
    })

    const emptyFields = dataArray.filter((el) => {
        if (el[1].trim() == '') {
            return true
        }
    }).map(el => el[0])

    if (emptyFields.length != 0) {
        error = true
        message.push('Campos vazios')
    }

    const resData = Object.fromEntries(dataArray)
    
    const tokenHash = crypto.createHash('sha256').update(resData.token).digest('hex');

    try {

        const token = await db.passwordresettoken.findUnique({
            where: {
                token: tokenHash
            }
        })
    
    
        const dateNow = new Date(Date.now())

        if (token?.expiresat && token?.expiresat < dateNow) {
            error = true
            message.push('Erro desconhecido')
        } else {
            
            try {
                const hash = await argon2.hash(resData.password)
                
                await db.usuario.update({
                    where: {
                        id: token?.createdby
                    },
                    data: {
                        password: hash
                    }
                })
            } catch {
                error = true
                message.push('Erro desconhecido')
            }
        }
    } catch {
        error = true
        message.push('Erro desconhecido')
    }
    
    if (error) {
       return {
        message: message,
        emptyFields: emptyFields,
        values: [resData]
    } 
    }

    return {
        message: ['Sucesso'],
        emptyFields: emptyFields,
        values: [resData]
    }
}