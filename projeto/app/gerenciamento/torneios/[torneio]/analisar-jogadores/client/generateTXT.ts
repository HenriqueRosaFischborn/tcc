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

    const year_now = new Date().getFullYear()

    for (const i in players) {
        if (players[i].status == 'Confirmada' || true) {
            x++
            cont += `${x};` // No
            cont += `${String(players[i].name.split(',')[1]).trim()} ${String(players[i].name.split(',')[0]).trim()};` // Nome Completo
            cont += `${players[i].titulo ? players[i].titulo : ''};` // Título <------- precisa programar
            cont += `${players[i].id_cbx ? players[i].id_cbx : 0};` //ID
            cont += `${players[i].rtg_cbx ? players[i].rtg_cbx : 0};` //Elonac
            cont += `${players[i].rtg_cbx ? players[i].rtg_fide : 0};` //FIDE
            cont += `${formatDate(players[i].data_nasc)};` //Dnasc
            cont += `${players[i].federation ? players[i].federation : 'BRA'};` //Fed
            cont += `${players[i].genre ? 0 : 1};` //Sexo
            cont += `;` // Cat aparentemente não precisa preencher
            cont += `${players[i].city};` // Gr
            cont += `0;` //NoClube
            cont += `${players[i].club ? players[i].club : ''};` // Nome Clube
            cont += `${players[i].id_fide ? players[i].id_fide : 0};` // FIDE
            cont += `;` // Fonte Aparentemente deve ficar vazia
            cont += `;` // Pts
            cont += `;` // Des1
            cont += `;` // Des2
            cont += `;` // Des3
            cont += `;` // Des4
            cont += `;` // Des5
            cont += `;` // Des6
            cont += `;` // Clas
            cont += `${String(players[i].name.split(',')[1]).trim()};` // Sobrenome
            cont += `${String(players[i].name.split(',')[0]).trim()};` // Nome
            cont += `;`; // Atítulo

            cont += `\n`
        }
    }
    

    return cont
}