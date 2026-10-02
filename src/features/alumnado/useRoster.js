import { useAsyncData } from "@/hooks/useAsyncData";
import { fetchAlumnosGrupo, fetchAsistencia } from "@/services/alumnos";

const EMPTY = { roster: [], asis: {} };

/** Alumnos activos de un grupo y su asistencia en una fecha. */
export function useRoster(grupo, fecha) {
  const { data, loading, reload } = useAsyncData(
    async () => {
      if (!grupo) return EMPTY;
      const roster = await fetchAlumnosGrupo(grupo);
      const asis = await fetchAsistencia(
        fecha,
        roster.map((a) => a.id),
      );
      return { roster, asis };
    },
    [grupo, fecha],
    EMPTY,
  );
  return { ...data, loading, reload };
}
