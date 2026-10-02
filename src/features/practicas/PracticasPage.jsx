import { Loading } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import PracticasGestion from "./components/PracticasGestion";
import PracticasTutor from "./components/PracticasTutor";
import { usePracticas } from "./usePracticas";

export default function PracticasPage() {
  const { me } = useAuth();
  const { gestionaPracticas } = usePermissions();
  const data = usePracticas();

  if (data.loading) return <Loading text="Cargando prácticas…" />;
  return gestionaPracticas ? <PracticasGestion data={data} /> : <PracticasTutor data={data} docente={me.docente} />;
}
