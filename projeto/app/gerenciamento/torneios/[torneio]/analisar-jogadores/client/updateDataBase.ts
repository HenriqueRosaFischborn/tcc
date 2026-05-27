'use server'

import { Player } from "@/lib/types"
import db from "@/lib/db"
import { sendConfirmedMessageEmail } from "@/app/api/email/confirmed-inscription/send"

type Inscricoes = {
    [key: string]: Player
}

export type UniqueDifferences = {
    city: string
    club: string
    genre: boolean
    data_nasc: Date
    id_fide: number
    id_cbx: number
    uuid_cat: string
    status: string
    id_usuario: number
    uuid: string
    name: string
    id_division: number
    id_torneio: number
    rtg_fide: number
    rtg_cbx: number
}

type Differences = {
    [key: string]: Partial<UniqueDifferences>
}

function setDiff<K extends keyof UniqueDifferences>(obj: Partial<UniqueDifferences>, key: K, value: UniqueDifferences[K]) {
    obj[key] = value
}

export default async function updateDataBase(prev: {message: string}, formdata: FormData) {
    const nameTournment = String(formdata.get('nameTournment')) 
    
    const defaultIncri = JSON.parse(String(formdata.get('defaultInscri'))) as Inscricoes

    const nowIncri = JSON.parse(String(formdata.get('nowInscri'))) as Inscricoes

    const differences: Differences = {}

    for (const uuid in defaultIncri) {
        const diff: Partial<UniqueDifferences> = {}
        const currentPlayer = nowIncri[uuid]!

        for (const key of Object.keys(defaultIncri[uuid]) as (keyof UniqueDifferences)[]) {

            
            const newValue = currentPlayer[key]
            
            const oldValue = defaultIncri[uuid][key]

            const isDifferent = typeof oldValue === 'object' && oldValue !== null ? JSON.stringify(oldValue) !== JSON.stringify(newValue) : oldValue !== newValue
            
            if (isDifferent) {
                if (key == 'status' && nowIncri[uuid][key] == 'Confirmada') {
                    await sendConfirmedMessageEmail(nowIncri[uuid], nameTournment)
                }

                setDiff(diff, key, newValue)
            }
        }

        differences[uuid] = diff
    }
    
    

    try {
    Object.keys(differences).map(async (k) => {
        await db.incricao.update({
            where: {
                uuid: k
            },
            data: differences[k] as Differences
        })
    })
        
    
        return {message: 'Alterações salvas'}
    } catch {
        console.log('erro')
        return {message: 'Erro'}
    }
}