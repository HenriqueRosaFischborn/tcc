'use client'

import { Player } from "@/lib/types"

type Inscricoes = {
    [key: string]: Player
}

export function generateTXT(players: Inscricoes) {
    function formatDate(date: Date) {
        const day = String(date.getUTCDate()).padStart(2, '0')
        const month = String(date.getUTCMonth() + 1).padStart(2, '0')
        const year = date.getUTCFullYear()

        return `${day}.${month}.${year}`
    }


    let cont = ''
    console.log(players)

    cont += 'No;Nome Completo;Título;ID;Elonac;FIDE;DNasc;Fed;Sexo;Cat;Gr;NoClube;Nome Clube;id FIDE;Fonte;Pts;Des1;Des2;Des3;Des4;Des5;Des6;Clas;Sobrenome;Nome;Atítulo\n'
    
    let x = 0
    for (const i in players) {
        if (players[i].status == 'Confirmada' || true) {
            x++
            cont += `${x};` // No
            cont += `${String(players[i].name.split(',')[1]).trim()} ${String(players[i].name.split(',')[0]).trim()};` // Nome Completo
            cont += `;` // Título
            cont += `${players[i].id_cbx};` //ID
            cont += `${players[i].rtg_cbx ? players[i].rtg_cbx : 0};` //Elonac
            cont += `${players[i].rtg_cbx ? players[i].rtg_fide : 0};` //FIDE
            cont += `${formatDate(players[i].data_nasc)};` //Dnasc
            cont += 'BRA;' //Fed
            cont += `${players[i].genre ? 0 : 1};` //Sexo

            cont += `\n`
        }
    }
    

    return cont
}