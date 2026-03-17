import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !/^https?:\/\//.test(supabaseUrl)) {
  throw new Error('Invalid Supabase URL: set VITE_SUPABASE_URL to http(s) URL')
}
if (!supabaseAnonKey) {
  throw new Error('Missing Supabase anon key: set VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
