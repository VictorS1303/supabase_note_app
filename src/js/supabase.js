import { createClient } from '@supabase/supabase-js'

const supabaseURL = import.meta.env.VITE_SUPABASE_URL
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY

console.log(createClient, supabaseURL, supabaseApiKey)

if (!supabaseURL || !supabaseApiKey)
{
  console.error('Supabase URL or API key is missing!')
}
else
{
  const supabase = createClient(supabaseURL, supabaseApiKey)
  console.log(supabase)
}