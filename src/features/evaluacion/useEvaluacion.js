import { useMemo } from "react";
import { DEFAULT_WEIGHTS } from "@/constants/encuesta";
import { SCHEDULE } from "@/data/schedule";
import { useAsyncData } from "@/hooks/useAsyncData";
import { fetchPesos, fetchRespuestas } from "@/services/encuesta";
import { deriveUnits } from "@/utils/schedule";

/** Respuestas + ponderación guardada + unidades (asignatura/grado) por profesor. */
export function useEvaluacion() {
  const { data, loading, setData } = useAsyncData(
    async () => {
      const [respuestas, weights] = await Promise.all([
        fetchRespuestas().catch(() => []),
        fetchPesos().catch(() => DEFAULT_WEIGHTS),
      ]);
      return { respuestas, weights };
    },
    [],
    { respuestas: [], weights: DEFAULT_WEIGHTS },
  );
  const units = useMemo(() => deriveUnits(SCHEDULE.clases), []);
  const nombres = useMemo(() => Object.keys(units).sort((a, b) => a.localeCompare(b)), [units]);
  const setWeights = (weights) => setData((d) => ({ ...d, weights }));
  return { loading, units, nombres, respuestas: data.respuestas, weights: data.weights, setWeights };
}
