import { useMemo, useState } from "react";
import { Card, Loading, SegmentedTabs, SelectRow } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { SCHEDULE } from "@/data/schedule";
import { usePermissions } from "@/hooks/usePermissions";
import { hoyISO } from "@/utils/format";
import { gruposDe } from "@/utils/schedule";
import Asistencia from "./components/Asistencia";
import GestionAlumnos from "./components/GestionAlumnos";
import { useRoster } from "./useRoster";
import "./alumnado.css";

export default function AlumnadoPage() {
  const { me } = useAuth();
  const { veTodosLosGrupos, gestionaAlumnos } = usePermissions();

  // Gestión ve todos los grupos; un profesor, solo los que tiene en su horario.
  const grupos = useMemo(() => {
    if (veTodosLosGrupos) return SCHEDULE.clases.map((c) => c.clase);
    return me.docente ? gruposDe(SCHEDULE.clases, me.docente) : [];
  }, [veTodosLosGrupos, me.docente]);

  const [grupoSel, setGrupo] = useState(null);
  const [fecha, setFecha] = useState(hoyISO);
  const [sub, setSub] = useState("asistencia");
  const grupo = grupos.includes(grupoSel) ? grupoSel : grupos[0] || null;
  const { roster, asis, loading, reload } = useRoster(grupo, fecha);
  const refresh = () => reload({ silent: true });

  if (!grupos.length) {
    return (
      <Card>
        <p className="muted">
          Aún no tienes grupos asignados. Si eres profesor, tu administrador debe vincular tu cuenta con tu nombre en
          Usuarios; si eres gestión, aquí verás todos los grupos.
        </p>
      </Card>
    );
  }

  const subs = [["asistencia", "Asistencia"]];
  if (gestionaAlumnos) subs.push(["gestion", "Gestionar alumnos"]);
  const vista = sub === "gestion" && gestionaAlumnos ? "gestion" : "asistencia";

  return (
    <>
      <div className="hbar">
        <SegmentedTabs options={subs} value={vista} onChange={setSub} />
        <SelectRow label="Grupo" style={{ margin: 0 }}>
          <select value={grupo} onChange={(e) => setGrupo(e.target.value)}>
            {grupos.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </SelectRow>
      </div>
      {loading ? (
        <Loading />
      ) : vista === "gestion" ? (
        <GestionAlumnos grupo={grupo} roster={roster} reload={refresh} />
      ) : (
        <Asistencia
          key={`${grupo}|${fecha}`}
          me={me}
          grupo={grupo}
          fecha={fecha}
          onFecha={setFecha}
          roster={roster}
          initialAsis={asis}
          puedeImportar={gestionaAlumnos}
        />
      )}
    </>
  );
}
