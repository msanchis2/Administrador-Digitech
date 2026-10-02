import { CREATE_USER_FN_URL } from "@/config/env";
import { getSession } from "./auth";
import { db, unwrap } from "./client";

export const fetchProfiles = async () =>
  (await unwrap(db("profiles").select("*").order("creado", { ascending: true }))) || [];

export const updateProfile = (id, patch) => unwrap(db("profiles").update(patch).eq("id", id));

/** Crea una cuenta a través de la Edge Function `admin-create-user`. */
export async function createUser({ email, password, nombre, rol }) {
  const session = await getSession();
  const resp = await fetch(CREATE_USER_FN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify({ email, password, nombre, rol }),
  });
  const out = await resp.json();
  if (!resp.ok) throw new Error(out.error || "Error al crear la cuenta");
  return out;
}
