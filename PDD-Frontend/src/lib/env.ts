// Safe helper to resolve environment variables across both Vite (Web) and Metro (Native) environments.
const getEnvVar = (key: string): string => {
  // 1. Native / Expo / Node environment check (process.env)
  if (typeof process !== 'undefined' && process && process.env) {
    const expoKey = `EXPO_PUBLIC_${key}`;
    if (process.env[expoKey]) return process.env[expoKey];
    if (process.env[key]) return process.env[key];
  }

  // 2. Safe global scope fallback for Web / Vite without triggering import.meta syntax errors in Hermes
  try {
    const globalObj = typeof window !== 'undefined' ? (window as any) : (globalThis as any);
    if (globalObj && globalObj.__VITE_ENV__ && globalObj.__VITE_ENV__[key]) {
      return globalObj.__VITE_ENV__[key];
    }
  } catch (e) {
    // Suppress
  }

  return '';
};

export const VITE_SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || 'https://jlpuvpppluxwnaowhfqx.supabase.co';
export const VITE_SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpscHV2cHBwbHV4d25hb3doZnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1ODkwMDMsImV4cCI6MjEwMTE2NTAwM30.WGr6WTEZseByMvMAG4_UtINEhTcy32R00TAme7wR8YY';
export const VITE_API_URL = getEnvVar('VITE_API_URL') || 'http://localhost:8080';
