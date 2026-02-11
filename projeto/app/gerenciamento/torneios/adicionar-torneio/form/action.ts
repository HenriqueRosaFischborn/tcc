'use server'

import { getSupabaseAdmin } from "@/lib/supabase"
import { NewTournment } from "@/lib/types"

export default async function addTournmentForm(prev: NewTournment, formdata: FormData): Promise<NewTournment> {
    console.log(formdata)

    

    // const fileFolder = formdata.get('fileFolder') as File

    // const filePath = `folder/${fileFolder?.name}`
    
    // const supabaseAdmin = await getSupabaseAdmin()
    // const {error} = await supabaseAdmin.storage.from('publics').upload(filePath, fileFolder, {
    //     upsert: true,
    //     contentType: fileFolder.type
    // })

    return {
        
    }
}