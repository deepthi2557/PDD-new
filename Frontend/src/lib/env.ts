const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  try {
    const getMetaEnv = new Function('return import.meta.env');
    const env = getMetaEnv();
    if (env && env[key]) {
      return env[key];
    }
  } catch (e) {}
  return '';
};

export const VITE_SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
export const VITE_SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY');
export const VITE_API_URL = getEnv('VITE_API_URL');
