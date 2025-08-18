import { createClient } from '@supabase/supabase-js'

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return { supabaseUrl, supabaseAnonKey }
}

let _supabase = null
let _supabaseAdmin = null

export const supabase = new Proxy({}, {
  get(target, prop) {
    if (!_supabase) {
      const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
      _supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
    return _supabase[prop]
  }
})

export const supabaseAdmin = new Proxy({}, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
      _supabaseAdmin = createClient(
        supabaseUrl,
        process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
    }
    return _supabaseAdmin[prop]
  }
})
