'use server'

import db from "@/lib/db"
import { getSupabaseAdmin } from "@/lib/supabase"

async function deleteById(folder: string, id: number) {
    const supabaseAdmin = await getSupabaseAdmin()

    const basePath = folder

    const { data, error } = await supabaseAdmin.storage
        .from("publics")
        .list(basePath, {
            limit: 1000
        })

    if (error) {
        throw new Error(error.message)
    }

    if (!data) return

    const item = data.find(file => file.name === String(id) || file.name.startsWith(`${id}.`))

    if (!item) {
        console.log(`Nada encontrado em ${folder}/${id}`)
        return
    }


    const fullPath = `${basePath}/${item.name}`


    // É arquivo
    if (item.metadata) {

        const { error } = await supabaseAdmin.storage
            .from("publics")
            .remove([fullPath])

        if (error) {
            throw new Error(error.message)
        }

        console.log("Arquivo deletado:", fullPath)
        return
    }


    // É pasta
    async function getAllFiles(path: string): Promise<string[]> {

        const { data, error } = await supabaseAdmin.storage
            .from("publics")
            .list(path, {
                limit: 1000
            })

        if (error) {
            throw new Error(error.message)
        }

        if (!data) return []

        const files: string[] = []

        for (const item of data) {

            const childPath = `${path}/${item.name}`

            if (item.metadata) {
                files.push(childPath)
            } else {
                files.push(...await getAllFiles(childPath))
            }
        }

        return files
    }


    const files = await getAllFiles(fullPath)

    console.log("Arquivos encontrados:", files)


    if (files.length > 0) {

        const { error } = await supabaseAdmin.storage
            .from("publics")
            .remove(files)

        if (error) {
            throw new Error(error.message)
        }
    }


    console.log("Pasta deletada:", fullPath)
}



export async function deleteTournment(id: number) {

    const folders = [
        "regulamentos",
        "qrCodes",
        "folders",
        "comprovantes"
    ]


    for (const folder of folders) {
        await deleteById(folder, id)
    }


    await db.torneio.delete({
        where: {
            id
        }
    })
}