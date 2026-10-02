import { db, unwrap } from "./client";

export const fetchPracticas = async () => (await unwrap(db("practicas").select("*"))) || [];

export const upsertPractica = (row) => unwrap(db("practicas").upsert(row).select().single());

export const deletePractica = (id) => unwrap(db("practicas").delete().eq("id", id));
