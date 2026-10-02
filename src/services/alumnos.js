import { db, unwrap } from "./client";

export const fetchAlumnosGrupo = async (grupo) =>
  (await unwrap(db("alumnos").select("*").eq("grupo", grupo).eq("activo", true).order("apellidos"))) || [];

export const fetchAlumnosActivos = async (cols = "*") =>
  (await unwrap(db("alumnos").select(cols).eq("activo", true))) || [];

export const insertAlumnos = (rows) => unwrap(db("alumnos").insert(rows));

export const updateAlumno = (id, patch) => unwrap(db("alumnos").update(patch).eq("id", id));

/** Baja lógica: el alumno deja de aparecer pero se conserva su historial. */
export const desactivarAlumno = (id) => updateAlumno(id, { activo: false });

/** Asistencia de un día → { [alumno_id]: {estado, nota} } */
export async function fetchAsistencia(fecha, ids) {
  if (!ids.length) return {};
  const rows = (await unwrap(db("asistencia").select("*").eq("fecha", fecha).in("alumno_id", ids))) || [];
  return Object.fromEntries(rows.map((r) => [r.alumno_id, { estado: r.estado, nota: r.nota || "" }]));
}

export const upsertAsistencia = (rows) => unwrap(db("asistencia").upsert(rows, { onConflict: "alumno_id,fecha" }));
