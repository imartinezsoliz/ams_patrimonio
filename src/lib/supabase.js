/**
 * Cliente de Supabase (único punto de creación).
 * Si faltan las variables VITE_SUPABASE_* en .env, `supabase` es null y
 * src/services/api.js responde con los datos de mockData.js.
 */
import { createClient } from '@supabase/supabase-js'

const env = import.meta.env ?? {}
const url = env.VITE_SUPABASE_URL
const anonKey = env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    })
  : null
