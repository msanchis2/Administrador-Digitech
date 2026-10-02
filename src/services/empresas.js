import { db, unwrap } from "./client";

export const fetchEmpresas = async () => (await unwrap(db("empresas").select("*").order("nombre"))) || [];

export const upsertEmpresa = (row) => unwrap(db("empresas").upsert(row).select().single());

export const insertEmpresas = async (rows) => (await unwrap(db("empresas").insert(rows).select())) || [];

export const deleteEmpresa = (id) => unwrap(db("empresas").delete().eq("id", id));
