import { useMemo } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { fetchAlumnosActivos } from "@/services/alumnos";
import { fetchEmpresas } from "@/services/empresas";
import { fetchPracticas } from "@/services/practicas";
import { nombreCompleto } from "@/utils/format";

const EMPTY = { alumnos: [], empresas: [], list: [] };

/** Prácticas con índices de alumnos y empresas para resolver nombres rápido. */
export function usePracticas() {
  const { data, setData, loading } = useAsyncData(
    async () => {
      const [alumnos, empresas, list] = await Promise.all([
        fetchAlumnosActivos("id,grupo,apellidos,nombre").catch(() => []),
        fetchEmpresas().catch(() => []),
        fetchPracticas().catch(() => []),
      ]);
      return { alumnos, empresas, list };
    },
    [],
    EMPTY,
  );

  const helpers = useMemo(() => {
    const alById = new Map(data.alumnos.map((a) => [a.id, a]));
    const empById = new Map(data.empresas.map((e) => [e.id, e]));
    return {
      alLabel: (id) => nombreCompleto(alById.get(id)),
      alGrupo: (id) => alById.get(id)?.grupo || "",
      empDe: (id) => empById.get(id),
    };
  }, [data.alumnos, data.empresas]);

  const setList = (fn) => setData((d) => ({ ...d, list: fn(d.list) }));

  return { loading, ...data, ...helpers, setList };
}
