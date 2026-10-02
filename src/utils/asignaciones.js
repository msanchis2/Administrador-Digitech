/**
 * Lógica de asignación de asignaturas a profesores sobre el horario.
 * Funciones puras (salvo las que se indica que mutan `clases`, pensadas para
 * usarse dentro de `HorarioContext.mutate`).
 *
 * `bloqueos` = { [profesor]: { "Lunes|1ª": true, … } } (no disponibilidad de las fichas).
 */
import { DIAS, HORAS } from "@/data/schedule";
import { byLocale } from "./format";
import { emptyDayHourMap, forEachSession } from "./schedule";

export const TOTAL_FRANJAS = DIAS.length * HORAS.length;

const estaBloqueado = (bloqueos, prof, h, d) => !!bloqueos?.[prof]?.[`${d}|${h}`];

/** Profesores ocupados en cada día/hora en todo el centro. */
export function ocupacionProfesores(clases) {
  const m = emptyDayHourMap(() => new Set());
  forEachSession(clases, (cell, _cl, h, d) => m[d][h].add(cell[1]));
  return m;
}

/**
 * ¿Puede `prof` dar clase a `clase` en (h, d)? Devuelve `null` si sí o el motivo si no.
 * `ignorar` = {h, d} de la sesión que se está moviendo (su casilla de origen no cuenta).
 */
export function motivoNoCabe(clases, bloqueos, clase, prof, h, d, ignorar = null) {
  const cl = clases.find((c) => c.clase === clase);
  if (cl.grid[h][d]) return "grupo ocupado";
  const esOrigen = (c, hh, dd) => ignorar && c.clase === clase && ignorar.h === hh && ignorar.d === dd;
  const ocupado = clases.some((c) => !esOrigen(c, h, d) && c.grid[h][d]?.[1] === prof);
  if (ocupado) return "profesor ocupado";
  if (estaBloqueado(bloqueos, prof, h, d)) return "no disponible";
  return null;
}

/** Franjas donde coinciden libres el grupo y el profesor (y el profesor está disponible). */
export function huecosCompatibles(clases, bloqueos, clase, prof) {
  const out = [];
  DIAS.forEach((d) =>
    HORAS.forEach((h) => {
      if (!motivoNoCabe(clases, bloqueos, clase, prof, h, d)) out.push({ h, d });
    }),
  );
  return out;
}

/** Horas que imparte un profesor y franjas en las que aún podría dar clase. */
export function cargaProfesor(clases, bloqueos, prof) {
  const ocup = ocupacionProfesores(clases);
  let impartidas = 0;
  let libres = 0;
  DIAS.forEach((d) =>
    HORAS.forEach((h) => {
      if (ocup[d][h].has(prof)) impartidas++;
      else if (!estaBloqueado(bloqueos, prof, h, d)) libres++;
    }),
  );
  return { impartidas, libres };
}

/** Asignaciones de un profesor: [{clase, asig, horas}] ordenadas por grupo y asignatura. */
export function asignacionesDe(clases, prof) {
  const map = new Map();
  forEachSession(clases, (cell, cl) => {
    if (cell[1] !== prof) return;
    const k = `${cl.clase}||${cell[0]}`;
    map.set(k, (map.get(k) || 0) + 1);
  });
  const orden = new Map(clases.map((c, i) => [c.clase, i]));
  return [...map.entries()]
    .map(([k, horas]) => {
      const [clase, asig] = k.split("||");
      return { clase, asig, horas };
    })
    .sort((a, b) => orden.get(a.clase) - orden.get(b.clase) || byLocale(a.asig, b.asig));
}

/** Profesores que imparten `asig` en `clase`. */
export function titularesDe(clases, clase, asig) {
  const cl = clases.find((c) => c.clase === clase);
  const s = new Set();
  HORAS.forEach((h) => DIAS.forEach((d) => cl.grid[h][d]?.[0] === asig && s.add(cl.grid[h][d][1])));
  return s;
}

/** Todas las asignaturas que aparecen en el horario (para sugerencias). */
export function todasLasAsignaturas(clases) {
  const s = new Set();
  forEachSession(clases, (cell) => s.add(cell[0]));
  return [...s].sort(byLocale);
}

/**
 * Comprueba si se puede añadir `asig` a `prof` en `clase` con `horas` sesiones.
 * Devuelve `null` si se puede o el motivo (texto) si no.
 */
export function validarAsignacion(clases, bloqueos, { prof, clase, asig, horas }) {
  if (!prof || !clase) return "Elige profesor y grupo";
  if (!asig?.trim()) return "Escribe la asignatura";
  if (!(horas >= 1)) return "Indica cuántas horas semanales";
  const titulares = titularesDe(clases, clase, asig);
  if (titulares.has(prof)) return `${prof} ya imparte «${asig}» en ${clase}`;
  if (titulares.size) return `«${asig}» en ${clase} ya la imparte ${[...titulares].join(", ")}`;
  const { libres } = cargaProfesor(clases, bloqueos, prof);
  if (libres < horas) return `${prof} solo tiene ${libres} h libres y la asignatura necesita ${horas}`;
  const huecos = huecosCompatibles(clases, bloqueos, clase, prof).length;
  if (huecos < horas) {
    return `Solo hay ${huecos} franja${huecos === 1 ? "" : "s"} en la que ${prof} y ${clase} están libres a la vez (hacen falta ${horas})`;
  }
  return null;
}

/**
 * Puntuación de una franja candidata: se prefieren huecos entre clases,
 * bloques seguidos de la misma asignatura y días con clase, sin amontonar
 * más de 3 horas de la asignatura en el mismo día.
 */
function puntuar(cl, asig, prof, h, d) {
  const i = HORAS.indexOf(h);
  const ocupadas = HORAS.map((hh, j) => (cl.grid[hh][d] ? j : -1)).filter((j) => j >= 0);
  const mismaHoy = HORAS.filter((hh) => cl.grid[hh][d]?.[0] === asig && cl.grid[hh][d]?.[1] === prof).length;
  const vecina = (j) => j >= 0 && j < HORAS.length && cl.grid[HORAS[j]][d];
  const vecinaMisma = (j) => vecina(j) && cl.grid[HORAS[j]][d][0] === asig && cl.grid[HORAS[j]][d][1] === prof;

  let s = 0;
  if (ocupadas.length >= 2 && i > ocupadas[0] && i < ocupadas[ocupadas.length - 1]) s += 4; // rellena un hueco
  if (vecinaMisma(i - 1) || vecinaMisma(i + 1))
    s += 3; // bloque seguido
  else if (vecina(i - 1) || vecina(i + 1)) s += 2; // pegada a otra clase
  if (!ocupadas.length) s -= 1; // abrir un día vacío
  if (mismaHoy >= 3) s -= 8;
  else if (mismaHoy === 2) s -= 2;
  return s;
}

/**
 * MUTA `clases`: coloca `horas` sesiones de `asig` con `prof` en `clase`.
 * Devuelve un texto de error (sin tocar nada) o la lista de franjas usadas.
 */
export function anadirAsignatura(clases, bloqueos, datos) {
  const error = validarAsignacion(clases, bloqueos, datos);
  if (error) return error;
  const { prof, clase, horas } = datos;
  const asig = datos.asig.trim();
  const cl = clases.find((c) => c.clase === clase);
  const colocadas = [];
  for (let n = 0; n < horas; n++) {
    const cands = huecosCompatibles(clases, bloqueos, clase, prof);
    if (!cands.length) return "No quedan huecos compatibles";
    let mejor = null;
    let mejorScore = -Infinity;
    cands.forEach((c) => {
      const s = puntuar(cl, asig, prof, c.h, c.d);
      if (s > mejorScore) {
        mejor = c;
        mejorScore = s;
      }
    });
    cl.grid[mejor.h][mejor.d] = [asig, prof];
    colocadas.push(mejor);
  }
  return colocadas;
}

/** MUTA `clases`: borra del horario todas las sesiones de `asig` con `prof` en `clase`. */
export function quitarAsignatura(clases, { prof, clase, asig }) {
  const cl = clases.find((c) => c.clase === clase);
  let n = 0;
  HORAS.forEach((h) =>
    DIAS.forEach((d) => {
      const cell = cl.grid[h][d];
      if (cell && cell[0] === asig && cell[1] === prof) {
        cl.grid[h][d] = null;
        n++;
      }
    }),
  );
  return n;
}
