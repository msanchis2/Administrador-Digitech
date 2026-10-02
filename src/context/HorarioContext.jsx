import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { SCHEDULE } from "@/data/schedule";
import { fetchDocentes } from "@/services/docentes";
import * as horarioService from "@/services/horario";
import { clone } from "@/utils/format";

const HorarioContext = createContext(null);
const MAX_HIST = 25;

/**
 * Horario compartido entre «Horarios» y «Profesorado». Vive por encima de las
 * rutas para que los cambios sin guardar no se pierdan al cambiar de pestaña.
 *
 * También guarda la disponibilidad de cada profesor (`bloqueos`, de las fichas)
 * para no colocar clases en franjas marcadas como «no disponible».
 */
export function HorarioProvider({ children }) {
  const [clases, setClases] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [hist, setHistState] = useState([]);
  const [bloqueos, setBloqueos] = useState({});
  const loading = useRef(null);
  const clasesRef = useRef(null);
  const savedRef = useRef(null);
  const histRef = useRef([]);

  const commit = useCallback((next) => {
    clasesRef.current = next;
    setClases(next);
  }, []);

  const setHist = useCallback((next) => {
    histRef.current = next;
    setHistState(next);
  }, []);

  /** Carga una única vez. Si la BD está vacía y se puede editar, la siembra con el horario base. */
  const ensureLoaded = useCallback(
    (canEdit) => {
      if (!loading.current) {
        loading.current = (async () => {
          let data;
          fetchDocentes()
            .then((rows) => setBloqueos(Object.fromEntries(rows.map((r) => [r.nombre, r.bloqueos || {}]))))
            .catch(() => {});
          try {
            data = await horarioService.fetchHorario();
            if (!data) {
              data = clone(SCHEDULE.clases);
              if (canEdit) await horarioService.saveHorario(data).catch(() => {});
            }
          } catch {
            data = clone(SCHEDULE.clases);
          }
          savedRef.current = data;
          commit(data);
          return data;
        })();
      }
      return loading.current;
    },
    [commit],
  );

  /**
   * Aplica `fn(copiaDeClases)`. Si `fn` devuelve un texto se interpreta como
   * error y no se aplica nada; si devuelve `false`, no hubo cambios.
   */
  const mutate = useCallback(
    (fn) => {
      const prev = clasesRef.current;
      const next = clone(prev);
      const res = fn(next);
      if (typeof res === "string") return res;
      if (res === false) return false;
      setHist([...histRef.current, prev].slice(-MAX_HIST));
      commit(next);
      setDirty(true);
      return true;
    },
    [commit, setHist],
  );

  const undo = useCallback(() => {
    const h = histRef.current;
    if (!h.length) return;
    commit(h[h.length - 1]);
    setHist(h.slice(0, -1));
  }, [commit, setHist]);

  const save = useCallback(async () => {
    await horarioService.saveHorario(clasesRef.current);
    savedRef.current = clasesRef.current;
    setDirty(false);
    setHist([]);
  }, [setHist]);

  /** Vuelve a la última versión guardada. */
  const discard = useCallback(() => {
    commit(savedRef.current);
    setDirty(false);
    setHist([]);
  }, [commit, setHist]);

  /** Lo llama la ficha del profesor al cambiar su disponibilidad. */
  const setBloqueosDocente = useCallback((nombre, b) => setBloqueos((all) => ({ ...all, [nombre]: b || {} })), []);

  const value = useMemo(
    () => ({
      clases,
      bloqueos,
      dirty,
      canUndo: hist.length > 0,
      ensureLoaded,
      mutate,
      undo,
      save,
      discard,
      setBloqueosDocente,
    }),
    [clases, bloqueos, dirty, hist.length, ensureLoaded, mutate, undo, save, discard, setBloqueosDocente],
  );
  return <HorarioContext.Provider value={value}>{children}</HorarioContext.Provider>;
}

export const useHorario = () => useContext(HorarioContext);
