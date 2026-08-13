import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from './env';

const supabaseUrl = VITE_SUPABASE_URL;
const supabaseAnonKey = VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Please check your environment variables.');
}

let client;
try {
  client = createClient(
    supabaseUrl || 'https://jlpuvpppluxwnaowhfqx.supabase.co', 
    supabaseAnonKey || 'placeholder'
  );
} catch (e) {
  console.error('Failed to initialize Supabase client:', e);
  // Safe fallback to prevent startup crash
  client = createClient('https://jlpuvpppluxwnaowhfqx.supabase.co', 'placeholder');
}

export const supabase = client;
