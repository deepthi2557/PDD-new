// Safe helper to resolve environment variables across both Vite (Web) and Metro (Native) environments.
const getEnvVar = (key: string): string => {
  try {
    // 1. Web / Vite environment check
    if (typeof import.meta !== 'undefined' && import.meta && (import.meta as any).env) {
      return (import.meta as any).env[key] || '';
    }
  } catch (e) {
    // Suppress web-specific reference errors on native
  }

  try {
    // 2. Native / Expo environment check
    if (typeof process !== 'undefined' && process && process.env) {
      const expoKey = `EXPO_PUBLIC_${key}`;
      return process.env[expoKey] || process.env[key] || '';
    }
  } catch (e) {
    // Suppress native-specific reference errors
  }

  return '';
};

export const VITE_SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
export const VITE_SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');
export const VITE_API_URL = getEnvVar('VITE_API_URL');
