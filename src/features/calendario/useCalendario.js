import { useCallback, useEffect, useState } from "react";
import * as cal from "@/services/calendario";

/** Año/mes (0-11) de inicio de un curso, o el actual. Evita el desfase UTC de `new Date("YYYY-MM-DD")`. */
export function inicioDe(curso) {
  if (curso?.inicio) {
    const [y, m] = curso.inicio.split("-").map(Number);
    return { y, m: m - 1 };
  }
  const d = new Date();
  return { y: d.getFullYear(), m: d.getMonth() };
}

/**
 * Cursos y eventos del calendario. Si no hay ningún curso y el usuario puede
 * gestionarlo, crea el 2026/27 con sus festivos.
 */
export function useCalendario(gestiona) {
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState([]);
  const [cursoId, setCursoId] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [mes, setMes] = useState(inicioDe(null));

  const selectCurso = useCallback(async (curso) => {
    setCursoId(curso?.id ?? null);
    setMes(inicioDe(curso));
    setEventos(curso ? await cal.fetchEventos(curso.id).catch(() => []) : []);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await cal.ensureCursos(gestiona);
      if (!alive) return;
      setCursos(list);
      await selectCurso(list.find((c) => c.activo) || list[0] || null);
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [gestiona, selectCurso]);

  const curso = cursos.find((c) => c.id === cursoId) || null;

  const moverMes = (delta) =>
    setMes(({ y, m }) => {
      const nm = m + delta;
      return { y: y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 };
    });

  const nuevoCurso = async (nombre) => {
    const cur = await cal.createCurso({ nombre, activo: false });
    setCursos((cs) => [...cs, cur]);
    setCursoId(cur.id);
    setEventos([]);
  };

  const marcarActual = async () => {
    await cal.marcarCursoActual(cursoId);
    setCursos((cs) => cs.map((c) => ({ ...c, activo: c.id === cursoId })));
  };

  const addEvento = async (ev) => {
    const nuevo = await cal.insertEvento({ ...ev, curso_id: cursoId });
    setEventos((es) => [...es, nuevo]);
  };

  const delEvento = async (id) => {
    await cal.deleteEvento(id);
    setEventos((es) => es.filter((x) => x.id !== id));
  };

  return {
    loading,
    cursos,
    curso,
    eventos,
    mes,
    moverMes,
    selectCurso,
    nuevoCurso,
    marcarActual,
    addEvento,
    delEvento,
  };
}
