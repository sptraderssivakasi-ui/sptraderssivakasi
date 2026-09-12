import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const defaultUrl = 'https://websuabugmjknzmaqzfi.supabase.co';
const defaultKey = 'sb_publishable_pioEQydt_VajxlN8J2Nqaw_W5ctH95S';

const readCredentials = () => ({
  url: (localStorage.getItem('sp_supabase_url') || envUrl || defaultUrl).trim().replace(/\/$/, ''),
  key: (localStorage.getItem('sp_supabase_anon_key') || envKey || defaultKey).trim()
});

let active = readCredentials();
let client = createClient(active.url, active.key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

export const getSupabaseCredentials = () => ({ ...active });

export const configureSupabase = (url, key) => {
  const next = { url: url.trim().replace(/\/$/, ''), key: key.trim() };
  if (!/^https:\/\/[^/]+\.supabase\.co$/.test(next.url) || !next.key) {
    throw new Error('Enter a valid Supabase project URL and publishable/anon key.');
  }
  localStorage.setItem('sp_supabase_url', next.url);
  localStorage.setItem('sp_supabase_anon_key', next.key);
  active = next;
  client = createClient(next.url, next.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  return client;
};

export const getSupabaseClient = () => client;
export const supabase = new Proxy({}, {
  get: (_target, prop) => {
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});
