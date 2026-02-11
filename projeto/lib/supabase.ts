'use server'

import { createClient } from '@supabase/supabase-js'

export async function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Variáveis do Supabase não carregadas')
  }

  return createClient(url, key)
}