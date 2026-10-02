import { DEFAULT_WEIGHTS } from "@/constants/encuesta";
import { db, unwrap } from "./client";

export const insertRespuesta = (row) => unwrap(db("respuestas").insert(row));

export const fetchRespuestas = async () => (await unwrap(db("respuestas").select("*"))) || [];

export async function fetchPesos() {
  const data = await unwrap(db("config").select("valor").eq("clave", "pesos_evaluacion").maybeSingle());
  return { ...DEFAULT_WEIGHTS, ...(data?.valor || {}) };
}

export const savePesos = (valor) => unwrap(db("config").upsert({ clave: "pesos_evaluacion", valor }));
