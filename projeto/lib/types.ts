'use server'

export type FormState = {
    message?: string[]
    emptyFields?: string[]
    values?: Record<string, string>[]
}

export type CredentialsType = {
    email: string | unknown,
    password: string | unknown,
    //callbackUrl: string | unknown
}

export type Info = {
    message?: string[],
    erro?: string,
    name?: string,
    borndate?: string,
    idfide?: number | null,
    idcbx?: number | null,
    catname?: string,
    value?: number,
    key_code?: string,
    qr_code?: string,
    status?: string
}

export type NewTournment = {
    
    message?: string,
    emptyFields?: string[]
    values?: {
        title: string
    }
}