import { createClient } from "@supabase/supabase-js";
import { isConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config/env";

/** Cliente único de Supabase. Es `null` si faltan las variables de entorno. */
export const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
