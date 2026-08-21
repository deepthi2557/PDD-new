import { createClient } from '@supabase/supabase-js';
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from './env';

const supabaseUrl = VITE_SUPABASE_URL || 'https://jlpuvpppluxwnaowhfqx.supabase.co';
const supabaseAnonKey = VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpscHV2cHBwbHV4d25hb3doZnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1ODkwMDMsImV4cCI6MjEwMTE2NTAwM30.WGr6WTEZseByMvMAG4_UtINEhTcy32R00TAme7wR8YY';

let client: any;
try {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false,
    },
  });
} catch (e) {
  console.error('Failed to initialize Supabase client:', e);
  client = createClient('https://jlpuvpppluxwnaowhfqx.supabase.co', 'placeholder', {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false,
    },
  });
}

export const supabase = client;
