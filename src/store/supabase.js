import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kmceogfkfjfiwfjojzsz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_I2Wf_ZcEhawVrZ3Oh8LJMg_lK02MbGG'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
