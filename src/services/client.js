import { supabase } from "@/lib/supabase";

/** Lanza el error de Supabase si lo hay y devuelve `data`. */
export async function unwrap(query) {
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export const db = (table) => supabase.from(table);
