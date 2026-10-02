import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHorario } from "@/context/HorarioContext";
import { useToast } from "@/context/ToastContext";
import { fetchDocentes, upsertDocente } from "@/services/docentes";
import { derivarCargas } from "@/utils/schedule";
import { buildFicha } from "./fichaModel";

const SAVE_DELAY = 700;

/**
 * Estado de las fichas: cargas derivadas del horario + datos guardados en
 * `docentes`. `updateFicha` aplica el cambio al instante y guarda con debounce.
 */
export function useFichas() {
  const toast = useToast();
  const { clases, ensureLoaded, setBloqueosDocente } = useHorario();
  const [docentes, setDocentes] = useState(null);
  const docentesRef = useRef({});
  const timers = useRef({});

  useEffect(() => {
    ensureLoaded(false);
    let alive = true;
    fetchDocentes()
      .catch(() => [])
      .then((rows) => {
        if (!alive) return;
        docentesRef.current = Object.fromEntries(rows.map((r) => [r.nombre, r]));
        setDocentes(docentesRef.current);
      });
    return () => {
      alive = false;
    };
  }, [ensureLoaded]);

  const cargas = useMemo(() => (clases ? derivarCargas(clases) : null), [clases]);
  const nombres = useMemo(() => (cargas ? Object.keys(cargas).sort((a, b) => a.localeCompare(b)) : []), [cargas]);

  const getFicha = useCallback((n) => buildFicha(n, docentes || {}, cargas || {}), [docentes, cargas]);

  const updateFicha = useCallback(
    (n, patch) => {
      const merged = { ...buildFicha(n, docentesRef.current, cargas || {}), ...patch };
      docentesRef.current = { ...docentesRef.current, [n]: merged };
      setDocentes(docentesRef.current);
      if (patch.bloqueos) setBloqueosDocente(n, patch.bloqueos);
      // El temporizador sobrevive al desmontaje a propósito: así no se pierde el último cambio.
      clearTimeout(timers.current[n]);
      timers.current[n] = setTimeout(() => {
        upsertDocente(merged).catch((e) => toast(`No se pudo guardar: ${e.message}`));
      }, SAVE_DELAY);
    },
    [cargas, toast, setBloqueosDocente],
  );

  return { loading: !cargas || !docentes, cargas, nombres, getFicha, updateFicha };
}
