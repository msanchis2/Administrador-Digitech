import { db, unwrap } from "./client";

export const fetchAusencias = async () =>
  (await unwrap(db("ausencias").select("*").order("fecha_inicio", { ascending: false }))) || [];

export const insertAusencia = (row) => unwrap(db("ausencias").insert(row).select().single());

export const deleteAusencia = (id) => unwrap(db("ausencias").delete().eq("id", id));
