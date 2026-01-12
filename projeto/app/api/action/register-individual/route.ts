'use server'

import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const body = await req.json()
    
    console.log('form enviado')
    console.log(body)

    return NextResponse.json({message: 'tudo certo'})
}