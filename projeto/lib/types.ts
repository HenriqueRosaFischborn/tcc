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
  id_fide: number
  id_cbx: number
  uuid_cat: string
  status: string
  id_usuario: number
  uuid: string
  name: string
  id_division: number
  id_torneio: number
  rtg_fide: number
  rtg_cbx: number
  categoria: {
    name: string
    uuid: string
    id_torneio: number
  }
  divisoes: {
    name: string,
    id: number
  }
  usuario: {
    id: number
    email: string,
  }
}

export type Cat = {
  uuid: string,
  name: string,
  default_division: number
}

export type Div = {
  id: number,
  name: string,
  isAbsolute: boolean
}

//number

export type Differences = {
  city: string
  club: string
  genre: boolean
  data_nasc: Date
  id_fide: number
  id_cbx: number
  uuid_cat: string
  status: string
  id_usuario: number
  uuid: string
  name: string
  id_division: number
  id_torneio: number
  rtg_fide: number
  rtg_cbx: number
}