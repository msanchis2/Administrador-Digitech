import { useEffect, useMemo, useState } from "react";
import CicloLegend from "@/components/schedule/CicloLegend";
import { Loading, SegmentedTabs } from "@/components/ui";
import { useHorario } from "@/context/HorarioContext";
import { usePermissions } from "@/hooks/usePermissions";
import { profesoresDe } from "@/utils/schedule";
import PorClase from "./components/PorClase";
import PorProfesor from "./components/PorProfesor";
import Reorganizar from "./components/Reorganizar";
import "./horarios.css";

export default function HorariosPage() {
  const { canEditHorarios } = usePermissions();
  const { clases, ensureLoaded } = useHorario();
  const [sub, setSub] = useState("clase");
  const [fct, setFct] = useState(false);
  const [selClase, setSelClase] = useState(null);
  const [selProf, setSelProf] = useState(null);

  useEffect(() => {
    ensureLoaded(canEditHorarios);
  }, [ensureLoaded, canEditHorarios]);

  const profesores = useMemo(() => (clases ? profesoresDe(clases) : []), [clases]);

  if (!clases) return <Loading text="Cargando horarios…" />;

  const subs = [
    ["clase", "Por clase"],
    ["profesor", "Por profesor"],
  ];
  if (canEditHorarios) subs.push(["reorg", "Reorganizar"]);

  const clase = clases.find((c) => c.clase === selClase) || clases[0];
  const prof = profesores.includes(selProf) ? selProf : profesores[0];
  const shared = { clases, fct, clase, onClase: setSelClase };

  return (
    <>
      <div className="hbar">
        <SegmentedTabs options={subs} value={sub} onChange={setSub} />
        <label className="fcttog">
          <input type="checkbox" checked={fct} onChange={(e) => setFct(e.target.checked)} /> Ver escenario «2º en FCT»
        </label>
      </div>
      <CicloLegend />
      {sub === "clase" && <PorClase {...shared} />}
      {sub === "profesor" && (
        <PorProfesor clases={clases} fct={fct} profesores={profesores} prof={prof} onProf={setSelProf} />
      )}
      {sub === "reorg" && canEditHorarios && <Reorganizar key={clase.clase} {...shared} profesores={profesores} />}
    </>
  );
}
