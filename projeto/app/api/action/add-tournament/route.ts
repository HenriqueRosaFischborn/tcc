import db from "@/lib/db"
import { getSupabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"


export async function POST(req: Request) {
    const formdata = await req.formData()

    const dataTimeAnalog = String(formdata.get('timeAnalog')).split('+').map(Number)
    const dataTimeDigital = String(formdata.get('timeDigital')).split('+').map(Number)

    const fileFolder = formdata.get('fileFolder') as File
    const fileReg = formdata.get('fileReg') as File
    
    const timeAnalog = await db.tempo.findFirst({
        where: {
            time: dataTimeAnalog[0],
            plus: dataTimeAnalog[1]
        },
        select: {
            id: true
        }
    }).then(res => {if (res) return Number(res.id)})

    const timeDigital = await db.tempo.findFirst({
        where: {
            time: dataTimeDigital[0],
            plus: dataTimeDigital[1]
        },
        select: {
            id: true
        }
    }).then(res => {if (res) return Number(res.id)})
    
    const dataDates = formdata.getAll('borndate') as string[]
    const dataHours = formdata.getAll('hour') as string[]


    const [d_e, m_e, y_e] = dataDates[0].split('/').map(Number)
    const [h_e, mi_e] = dataHours[0].split(':').map(Number)

    const [d_i, m_i, y_i] = dataDates[1].split('/').map(Number)
    const [h_i, mi_i] = dataHours[1].split(':').map(Number)

    const date_e = new Date(y_e, m_e - 1, d_e, h_e, mi_e)
    const date_i = new Date(y_i, m_i - 1, d_i, h_i, mi_i)
    

    const tournment = await db.torneio.create({
        data: {
            title: formdata.get('title') as string,
            time_analog: timeAnalog,
            time_digital: timeDigital,
            local: formdata.get('local') as string,
            local_link: formdata.get('local') as string,
            date_event: date_e,
            date_inscri: date_i,
            folder_path: fileFolder.size != 0 ? `folders/${fileFolder.name}` : null,
            reg_path: fileReg.size != 0 ? `regulamentos/${fileReg.name}` : null,
        }
    })

    const emails = JSON.parse(String(formdata.get('emails'))) as string[]

    for (let i = 0 ; i < emails.length ; i++) {
        await db.emails.create({
            data: {
                id_torneio: tournment.id,
                email: emails[i]
            }
        })
    }

    const categories = JSON.parse(String(formdata.get('categories')))
    

    for (let i = 0 ; i < categories.length ; i++) {
        const value = Number(categories[i].value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim())
        
        
        await db.categoria.create({
            data: {
                name: categories[i].name as string,
                id_torneio: tournment.id,
                value: value as number,
                fide: categories[i].fide as boolean,
                cbx: categories[i].cbx as boolean,
                just_superior: categories[i].justSuperior as boolean,
                min_y: categories[i].from as number,
                max_y: categories[i].to as number
            }
        })
    }

    
    if (fileFolder.size != 0) {
        const filePath = `folders/${fileFolder?.name}`
        
        const supabaseAdmin = await getSupabaseAdmin()
        const {error} = await supabaseAdmin.storage.from('publics').upload(filePath, fileFolder, {
            upsert: true,
            contentType: fileFolder.type
        })
    }

    if (fileReg.size != 0) {
        const filePath = `regulamentos/${fileReg.name}`
        
        const supabaseAdmin = await getSupabaseAdmin()
        const {error} = await supabaseAdmin.storage.from('publics').upload(filePath, fileFolder, {
            upsert: true,
            contentType: fileFolder.type
        })
    }

    return NextResponse.redirect(new URL('/gerenciamento/torneios', req.url))
}