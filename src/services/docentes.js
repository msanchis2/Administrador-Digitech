import { nowISO, numOrNull } from "@/utils/format";
import { db, unwrap } from "./client";

export const fetchDocentes = async () => (await unwrap(db("docentes").select("*"))) || [];

export const upsertDocente = (f) =>
  unwrap(
    db("docentes").upsert({
      nombre: f.nombre,
      edad: numOrNull(f.edad),
      experiencia: numOrNull(f.experiencia),
      titulacion: f.titulacion || null,
      cargo_tipo: f.cargo_tipo,
      cargo_detalle: f.cargo_detalle || null,
      idoneidad: f.idoneidad || null,
      habilitacion: f.habilitacion || [],
      bloqueos: f.bloqueos || {},
      notas: f.notas || null,
      foto: f.foto || null,
      presentacion: f.presentacion || null,
      linkedin: f.linkedin || null,
      web: f.web || null,
      actualizado: nowISO(),
    }),
  );
