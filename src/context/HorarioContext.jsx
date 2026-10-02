import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { SCHEDULE } from "@/data/schedule";
import * as horarioService from "@/services/horario";
import { clone } from "@/utils/format";

const HorarioContext = createContext(null);
const MAX_HIST = 25;

/**
 * Horario compartido entre «Horarios» y «Profesorado». Vive por encima de las
 * rutas para que los cambios sin guardar no se pierdan al cambiar de pestaña.
 */
export function HorarioProvider({ children }) {
  const [clases, setClases] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [hist, setHistState] = useState([]);
  const loading = useRef(null);
  const clasesRef = useRef(null);
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
          try {
            data = await horarioService.fetchHorario();
            if (!data) {
              data = clone(SCHEDULE.clases);
              if (canEdit) await horarioService.saveHorario(data).catch(() => {});
            }
          } catch {
            data = clone(SCHEDULE.clases);
          }
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
    setDirty(false);
    setHist([]);
  }, [setHist]);

  const value = useMemo(
    () => ({ clases, dirty, canUndo: hist.length > 0, ensureLoaded, mutate, undo, save }),
    [clases, dirty, hist.length, ensureLoaded, mutate, undo, save],
  );
  return <HorarioContext.Provider value={value}>{children}</HorarioContext.Provider>;
}

export const useHorario = () => useContext(HorarioContext);
