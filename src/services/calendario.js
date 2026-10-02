import { FESTIVOS_2627 } from "@/constants/calendario";
import { db, unwrap } from "./client";

export const fetchCursos = async () => (await unwrap(db("cursos").select("*").order("creado"))) || [];

export const createCurso = (curso) => unwrap(db("cursos").insert(curso).select().single());

/** Crea el curso 2026/27 con sus festivos (primer arranque). */
async function seedCursoInicial() {
  const cur = await createCurso({ nombre: "2026/27", inicio: "2026-09-01", fin: "2027-06-30", activo: true });
  const rows = FESTIVOS_2627.map((fecha) => ({
    curso_id: cur.id,
    fecha,
    tipo: "festivo",
    titulo: "Festivo",
    aplica: "ambos",
  }));
  await unwrap(db("calendario").insert(rows));
  return cur;
}

let pending = null;

/**
 * Devuelve los cursos y, si no hay ninguno y `puedeCrear`, siembra el 2026/27.
 * Las llamadas simultáneas comparten la misma petición: así un doble montaje
 * (p. ej. StrictMode) no crea el curso dos veces.
 */
export function ensureCursos(puedeCrear) {
  if (!pending) {
    pending = (async () => {
      const list = await fetchCursos().catch(() => []);
      if (list.length || !puedeCrear) return list;
      try {
        return [await seedCursoInicial()];
      } catch {
        return []; // sin permisos o error de red: la vista muestra «sin cursos»
      }
    })().finally(() => {
      pending = null;
    });
  }
  return pending;
}

export async function marcarCursoActual(id) {
  await unwrap(db("cursos").update({ activo: false }).neq("id", "00000000-0000-0000-0000-000000000000"));
  await unwrap(db("cursos").update({ activo: true }).eq("id", id));
}

export const fetchEventos = async (cursoId) =>
  (await unwrap(db("calendario").select("*").eq("curso_id", cursoId))) || [];

export const insertEvento = (ev) => unwrap(db("calendario").insert(ev).select().single());

export const deleteEvento = (id) => unwrap(db("calendario").delete().eq("id", id));
