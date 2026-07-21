'use client'

import { Player } from "@/lib/types"
import { sendCancelSolicitation } from "../api/email/cancel-solicitation/send"

export default async function ButtonCancelSolicitation({inscricao, torneio, torneioID}: {inscricao: Player, torneio: string, torneioID: number}) {
    return (
        <>
            <button onClick={ async (e) => {
                if (confirm('Tem certeza que deseja solicitar cancelamento dessa inscrição?')) {
                    await sendCancelSolicitation(inscricao, torneio, torneioID)
                    alert('Solicitação enviada')
                }
            }} className="button black">Solicitar cancelamento da inscrição</button>
        </>
    )
}