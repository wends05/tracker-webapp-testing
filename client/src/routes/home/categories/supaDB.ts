
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://cjqudvdhgvyupoehxgfq.supabase.co'
const supabaseKey: any = process.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


export default supabase


