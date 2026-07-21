'use server'

import * as cheerio from 'cheerio'

export async function searchFide(id: string) {
    console.log('Começou')
    const res = await fetch(`https://ratings.fide.com/profile/${id}`, {
        next: {
            revalidate: 60 * 60 * 24 * 7 // 7 dias
        },
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    })

    const html = await res.text()

    const $ = cheerio.load(html)
    
    const notFound = $('.row.no-gutters').text().trim()

    if (notFound) {
        return {
            name: 'Usuário FIDE não encontrado'
        }
    }

    const name = $('.player-title').text().trim()
    const bornYear = $('.profile-info-byear').text().trim()
    const genre = $('.profile-info-sex').text().trim()
    const ratings = $('.profile-games').text().trim().match(/Not rated|\d+/g)
    const title = $('.profile-info-row').text().trim().match(/FIDE title\s*([A-Za-z]+)/i)?.[1]
    
    return {
        name: name,
        bornYear: bornYear,
        genre: genre == 'Male' ? 'm' : 'f',
        title: title,
        idFide: id,
        ratings: {
            standard: ratings? ratings[0] == 'Not rated' ? '0' : ratings[0] : '0',
            rapid: ratings? ratings[1] == 'Not rated' ? '0' : ratings[1] : '0',
            blitz: ratings? ratings[2] == 'Not rated' ? '0' : ratings[2] : '0'
        }
    }
}

export async function searchCbx(id: string) {
    console.log('Começou')
    const res = await fetch(`https://www.cbx.org.br/jogador/${id}`, {
        next: {
            revalidate: 60 * 60 * 24 * 7 // 7 dias
        },
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    })

    const html = await res.text()

    const $ = cheerio.load(html)

    const texto = $('#dados-jogador-row1').text().trim() 
    
    if (texto == '') {
        return {
            name: 'Usuário CBX não encontrado'
        }
    }

    const name = texto.match(/^([\s\S]+?)\s*Data Nasc\./)?.[1]?.trim();

    const bornYear = texto.match(/Data Nasc\.\:\s*([\d/]+)/)?.[1]

    const idFide = texto.match(/ID FIDE:\s*(\d+)/)?.[1];

    const table = $('#ContentPlaceHolder1_gdvRating').text().trim()
   
    const match= table.match(/[A-Za-zÀ-ÿ]{3}\/\d{4}(\d{4})(\d{4})(\d{4})/)

    let ratings = {
        rapid: '',
        standard: '',
        blitz: ''
    }

    if (match) {
        ratings.rapid = match[1]
        ratings.standard = match[2]
        ratings.blitz = match[3]
    }
    
    return {
        name: name,
        bornYear: bornYear,
        idFide: idFide,
        ratings: ratings
    }
}