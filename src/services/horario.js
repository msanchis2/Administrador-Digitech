import { DIAS, HORAS } from "@/data/schedule";
import { nowISO } from "@/utils/format";
import { db, unwrap } from "./client";

/** Devuelve las clases guardadas o `null` si aún no hay horario en la BD. */
export async function fetchHorario() {
  const data = await unwrap(db("horario").select("datos").eq("id", 1).maybeSingle());
  return data?.datos?.clases || null;
}

export const saveHorario = (clases) =>
  unwrap(db("horario").upsert({ id: 1, datos: { dias: DIAS, horas: HORAS, clases }, actualizado: nowISO() }));
