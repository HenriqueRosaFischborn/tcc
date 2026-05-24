'use server'

import { UUID } from "crypto"

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

export type Player = {
  city: string
  club: string
  genre: boolean
  data_nasc: Date
  id_fide: bigint
  id_cbx: bigint
  uuid_cat: string
  status: string
  id_usuario: number
  uuid: string
  name: string
  id_division: bigint
  id_torneio: bigint
  rtg_fide: bigint
  rtg_cbx: bigint
  categoria: {
    name: string
    uuid: string
    id_torneio: bigint
  }
  divisoes: {
    name: string,
    id: bigint
  }
  usuario: {
    id: number,

  }
}

export type Cat = {
  uuid: string,
  name: string,
  default_division: bigint
}

export type Div = {
  id: bigint,
  name: string,
  isAbsolute: boolean
}