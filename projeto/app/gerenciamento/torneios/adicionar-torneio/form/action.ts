'use server'

import { NewTournment } from "@/lib/types"

export default async function addTournmentForm(prev: NewTournment, formdata: FormData): Promise<NewTournment> {
    console.log(formdata)
    
    return {
        
    }
}