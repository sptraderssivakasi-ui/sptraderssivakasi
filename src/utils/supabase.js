import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://websuabugmjknzmaqzfi.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_pioEQydt_VajxlN8J2Nqaw_W5ctH95S';

export const supabase = createClient(supabaseUrl, supabaseKey);
