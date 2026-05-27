'use server'

import { Player } from "@/lib/types"

type Inscricoes = {
    [key: string]: Player
}

export default async function generateXLStable(players: Inscricoes) {
    console.log('Gerar tabela com: ', players)
}