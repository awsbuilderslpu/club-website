import { createClient } from '@supabase/supabase-js'

export function createSupabasePublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase public client credentials are not configured.')
  }

  return createClient(supabaseUrl, supabaseKey)
}