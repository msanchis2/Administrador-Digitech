import { DIAS, HORAS } from "@/data/schedule";
import {
  CICLOS,
  CICLOS_GRADO_MEDIO,
  CICLOS_KEYS,
  CICLO_DESCONOCIDO,
  PROF_COL,
  PROF_COL_DEFAULT,
} from "@/constants/ciclos";
import { byLocale } from "./format";

/* ---------- Helpers de clase ---------- */

export const cicloDe = (clase) => CICLOS.find((x) => clase.includes(x.k)) || CICLO_DESCONOCIDO;

export const cicloKey = (clase) => CICLOS_KEYS.find((k) => clase.includes(k)) || "?";

export const gradoDe = (clase) => (CICLOS_GRADO_MEDIO.has(cicloKey(clase)) ? "Medio" : "Superior");

/**
 * Curso (1 o 2) de una clase. Usa `cl.curso` si existe y, si no, lo deduce del
 * nombre («1º DAM» → 1). El horario base no trae `curso`, así que sin esto el
 * escenario «2º en FCT» no atenuaba nada.
 */
export const cursoDe = (cl) => cl.curso ?? (parseInt(cl.clase, 10) || null);

export const profCol = (p) => PROF_COL[p] || PROF_COL_DEFAULT;

/** Recorre todas las celdas ocupadas: fn(cell, clase, hora, dia). */
export function forEachSession(clases, fn) {
  clases.forEach((cl) =>
    HORAS.forEach((h) =>
      DIAS.forEach((d) => {
        const cell = cl.grid[h][d];
        if (cell) fn(cell, cl, h, d);
      }),
    ),
  );
}

/** Rejilla vacía dia → hora → valor. */
export const emptyDayHourMap = (factory) =>
  Object.fromEntries(DIAS.map((d) => [d, Object.fromEntries(HORAS.map((h) => [h, factory()]))]));

/* ---------- Derivados del horario ---------- */

export function profesoresDe(clases) {
  const s = new Set();
  forEachSession(clases, (cell) => s.add(cell[1]));
  return [...s].sort(byLocale);
}

/** Clases en las que imparte un profesor. */
export function gruposDe(clases, prof) {
  const s = new Set();
  forEachSession(clases, (cell, cl) => {
    if (cell[1] === prof) s.add(cl.clase);
  });
  return [...s];
}

/** Por profesor: lista de {asig, grado, ses} ordenada por sesiones. */
export function deriveUnits(clases) {
  const map = {};
  forEachSession(clases, (cell, cl) => {
    const t = cell[1];
    const k = `${cell[0]}||${gradoDe(cl.clase)}`;
    map[t] = map[t] || {};
    map[t][k] = (map[t][k] || 0) + 1;
  });
  const out = {};
  Object.keys(map).forEach((t) => {
    out[t] = Object.entries(map[t])
      .map(([k, ses]) => {
        const [asig, grado] = k.split("||");
        return { asig, grado, ses };
      })
      .sort((a, b) => b.ses - a.ses);
  });
  return out;
}

/** Resumen de carga por profesor para las fichas. */
export function derivarCargas(clases) {
  const prof = {};
  const ens = (p) =>
    (prof[p] = prof[p] || {
      total: 0,
      h1: 0,
      h2: 0,
      ciclos: new Set(),
      centros: new Set(),
      clases: new Set(),
      asignaturas: new Set(),
      grados: new Set(),
    });
  forEachSession(clases, (cell, cl) => {
    const p = ens(cell[1]);
    p.total++;
    if (cursoDe(cl) === 1) p.h1++;
    else p.h2++;
    p.ciclos.add(cicloKey(cl.clase));
    if (cl.centro) p.centros.add(cl.centro);
    p.clases.add(cl.clase);
    p.asignaturas.add(cell[0]);
    p.grados.add(gradoDe(cl.clase));
  });
  const sorted = (s) => [...s].sort();
  const out = {};
  Object.entries(prof).forEach(([k, p]) => {
    out[k] = {
      total: p.total,
      h1: p.h1,
      h2: p.h2,
      ciclos: sorted(p.ciclos),
      centros: sorted(p.centros),
      clases: sorted(p.clases),
      asignaturas: sorted(p.asignaturas),
      grados: sorted(p.grados),
    };
  });
  return out;
}

export const CARGA_VACIA = { total: 0, h1: 0, h2: 0, ciclos: [], centros: [], clases: [], grados: [], asignaturas: [] };

/* ---------- Reorganización ---------- */

/** Profesores ocupados en cada dia/hora en todas las clases salvo `exceptClase`. */
export function busyOthers(clases, exceptClase) {
  const m = emptyDayHourMap(() => new Set());
  forEachSession(clases, (cell, cl, h, d) => {
    if (cl.clase !== exceptClase) m[d][h].add(cell[1]);
  });
  return m;
}

/** Huecos (horas libres entre dos sesiones) de cada día. */
export function gapsOf(cl) {
  const g = {};
  DIAS.forEach((d) => {
    const idx = HORAS.map((h, i) => (cl.grid[h][d] ? i : -1)).filter((i) => i >= 0);
    g[d] = new Set();
    if (idx.length >= 2) {
      for (let i = idx[0] + 1; i < idx[idx.length - 1]; i++) if (!idx.includes(i)) g[d].add(HORAS[i]);
    }
  });
  return g;
}

/** Profesores que se quedan sin carga si 2º está en FCT. */
export function profesoresLibresEnFct(clases) {
  const load = {};
  forEachSession(clases, (cell, cl) => {
    const p = (load[cell[1]] = load[cell[1]] || { t: 0, dos: 0 });
    p.t++;
    if (cursoDe(cl) === 2) p.dos++;
  });
  return Object.keys(load)
    .filter((p) => load[p].t > 0 && load[p].t === load[p].dos)
    .sort();
}

/**
 * Intercambia dos sesiones de una clase (muta `cl`). Respeta los demás grupos y
 * la disponibilidad (`bloqueos`) de los profesores.
 * Devuelve `null` si se ha hecho o un mensaje de error si hay conflicto.
 */
export function trySwap(clases, cl, a, b, bloqueos = {}) {
  const sa = cl.grid[a.h][a.d];
  const sb = cl.grid[b.h][b.d];
  const busy = busyOthers(clases, cl.clase);
  if (busy[b.d][b.h].has(sa[1])) return `${sa[1]} ya imparte a la hora de destino en otra clase`;
  if (busy[a.d][a.h].has(sb[1])) return `${sb[1]} ya imparte a la hora de origen en otra clase`;
  if (bloqueos[sa[1]]?.[`${b.d}|${b.h}`]) return `${sa[1]} no está disponible a la hora de destino`;
  if (bloqueos[sb[1]]?.[`${a.d}|${a.h}`]) return `${sb[1]} no está disponible a la hora de origen`;
  cl.grid[b.h][b.d] = sa;
  cl.grid[a.h][a.d] = sb;
  return null;
}

/** Sube todas las sesiones de cada día a primera hora respetando conflictos (muta). */
export function compact(clases, claseName) {
  const cl = clases.find((x) => x.clase === claseName);
  const busy = busyOthers(clases, claseName);
  DIAS.forEach((d) => {
    const sessions = HORAS.map((h) => cl.grid[h][d]).filter(Boolean);
    HORAS.forEach((h) => (cl.grid[h][d] = null));
    let ti = 0;
    for (const s of sessions) {
      while (ti < HORAS.length) {
        const h = HORAS[ti];
        ti++;
        if (!busy[d][h].has(s[1])) {
          cl.grid[h][d] = s;
          break;
        }
      }
    }
  });
}
