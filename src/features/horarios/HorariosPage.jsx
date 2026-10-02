import { useEffect, useMemo, useState } from "react";
import CicloLegend from "@/components/schedule/CicloLegend";
import { Loading, SegmentedTabs } from "@/components/ui";
import { useHorario } from "@/context/HorarioContext";
import { SCHEDULE } from "@/data/schedule";
import { usePermissions } from "@/hooks/usePermissions";
import { byLocale } from "@/utils/format";
import { profesoresDe } from "@/utils/schedule";
import Asignaciones from "./components/Asignaciones";
import EditBar from "./components/EditBar";
import PorClase from "./components/PorClase";
import PorProfesor from "./components/PorProfesor";
import "./horarios.css";

const SUBS = [
  ["clase", "Por clase"],
  ["profesor", "Por profesor"],
  ["asignaturas", "Asignaturas"],
];

export default function HorariosPage() {
  const { canEditHorarios } = usePermissions();
  const { clases, bloqueos, dirty, ensureLoaded } = useHorario();
  const [sub, setSub] = useState("clase");
  const [fct, setFct] = useState(false);
  const [selClase, setSelClase] = useState(null);
  const [selProf, setSelProf] = useState(null);
  // Si se vuelve a la página con cambios pendientes, se sigue en modo edición.
  const [editing, setEditing] = useState(dirty);

  useEffect(() => {
    ensureLoaded(canEditHorarios);
  }, [ensureLoaded, canEditHorarios]);

  // Aviso del navegador al cerrar o recargar con cambios sin guardar.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Incluye a quien se haya quedado sin clases para poder volver a asignarle.
  const profesores = useMemo(() => {
    if (!clases) return [];
    const s = new Set([...profesoresDe(clases), ...profesoresDe(SCHEDULE.clases), ...Object.keys(bloqueos)]);
    return [...s].sort(byLocale);
  }, [clases, bloqueos]);

  if (!clases) return <Loading text="Cargando horarios…" />;

  const isEditing = editing && canEditHorarios;
  const clase = clases.find((c) => c.clase === selClase) || clases[0];
  const prof = profesores.includes(selProf) ? selProf : profesores[0];
  const common = { clases, bloqueos, fct, editing: isEditing };

  return (
    <>
      {isEditing && <EditBar onExit={() => setEditing(false)} />}
      <div className="hbar">
        <SegmentedTabs options={SUBS} value={sub} onChange={setSub} />
        <div className="hbar-right">
          <label className="fcttog">
            <input type="checkbox" checked={fct} onChange={(e) => setFct(e.target.checked)} /> Ver escenario «2º en FCT»
          </label>
          {canEditHorarios && !isEditing && (
            <button type="button" className="btn primary" onClick={() => setEditing(true)}>
              ✏️ Editar horario
            </button>
          )}
        </div>
      </div>
      {sub !== "asignaturas" && <CicloLegend />}
      {sub === "clase" && <PorClase {...common} clase={clase} onClase={setSelClase} />}
      {sub === "profesor" && <PorProfesor {...common} profesores={profesores} prof={prof} onProf={setSelProf} />}
      {sub === "asignaturas" && <Asignaciones {...common} profesores={profesores} prof={selProf} onProf={setSelProf} />}
    </>
  );
}
