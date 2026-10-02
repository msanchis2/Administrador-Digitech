/**
 * Variables de entorno (Vite solo expone las que empiezan por VITE_).
 * Ver `.env.example`.
 */
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
export const CREATE_USER_FN_URL = import.meta.env.VITE_CREATE_USER_FN_URL ?? "";

export const isConfigured = SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 20;
