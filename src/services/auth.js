import { supabase } from "@/lib/supabase";
import { db, unwrap } from "./client";

export const getSession = async () => (await supabase.auth.getSession()).data.session;

export const signIn = (email, password) => unwrap(supabase.auth.signInWithPassword({ email, password }));

export const signOut = () => supabase.auth.signOut();

export const onAuthChange = (cb) => supabase.auth.onAuthStateChange((_event, session) => cb(session)).data.subscription;

/** Perfil del usuario (tabla `profiles`) normalizado para la app. */
export async function loadProfile(user) {
  const { data } = await db("profiles").select("*").eq("id", user.id).single();
  return {
    id: user.id,
    email: user.email,
    rol: data?.rol || "profesor",
    nombre: data?.nombre || user.email,
    edita_horarios: !!data?.edita_horarios,
    edita_fichas: !!data?.edita_fichas,
    docente: data?.docente_nombre || null,
  };
}
