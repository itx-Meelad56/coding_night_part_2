import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://aqwhudjmoxsmrtogiknf.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_IIIvC6GbgLTPVYy9UQJZPg_J5_rOstA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

