import { useState } from "react";
import CicloLegend from "@/components/schedule/CicloLegend";
import { Card, Loading, SegmentedTabs, SelectRow } from "@/components/ui";
import { FILTROS_CURSO, MESES, TIPO_CAL } from "@/constants/calendario";
import { useToast } from "@/context/ToastContext";
import { usePermissions } from "@/hooks/usePermissions";
import EventoForm from "./components/EventoForm";
import EventosList from "./components/EventosList";
import MonthGrid from "./components/MonthGrid";
import { useCalendario } from "./useCalendario";
import "./calendario.css";

const LEYENDA = Object.entries(TIPO_CAL).map(([k, t]) => ({ key: k, color: t[1], label: t[2] }));

export default function CalendarioPage() {
  const toast = useToast();
  const { gestionaCalendario: g } = usePermissions();
  const c = useCalendario(g);
  const [filtro, setFiltro] = useState("ambos");
  const [addDate, setAddDate] = useState("");

  if (c.loading) return <Loading text="Cargando calendario…" />;

  if (!c.cursos.length) {
    return (
      <Card>
        <p className="muted">
          Aún no hay ningún curso.{" "}
          {g ? "Recarga en un momento; se está creando el 2026/27." : "Pide a gestión que configure el curso."}
        </p>
      </Card>
    );
  }

  const eventosDe = (iso) =>
    c.eventos.filter((e) => e.fecha === iso && (filtro === "ambos" || e.aplica === "ambos" || e.aplica === filtro));

  const onNuevoCurso = async () => {
    const nombre = window.prompt("Nombre del nuevo curso (p. ej. 2027/28):");
    if (!nombre) return;
    try {
      await c.nuevoCurso(nombre.trim());
      toast("Curso creado");
    } catch (e) {
      toast(`No se pudo crear: ${e.message}`);
    }
  };

  const onMarcarActual = async () => {
    try {
      await c.marcarActual();
      toast("Marcado como curso actual");
    } catch (e) {
      toast(`No se pudo: ${e.message}`);
    }
  };

  return (
    <>
      <div className="calbar">
        <SelectRow label="Curso" style={{ margin: 0 }}>
          <select
            value={c.curso?.id || ""}
            onChange={(e) => c.selectCurso(c.cursos.find((x) => x.id === e.target.value))}
          >
            {c.cursos.map((x) => (
              <option key={x.id} value={x.id}>
                {x.nombre}
                {x.activo ? " · actual" : ""}
              </option>
            ))}
          </select>
          {g && (
            <>
              <button type="button" className="btn" onClick={onNuevoCurso}>
                ＋ Curso
              </button>
              {c.curso && !c.curso.activo && (
                <button type="button" className="btn" onClick={onMarcarActual}>
                  Marcar actual
                </button>
              )}
            </>
          )}
        </SelectRow>
        <SegmentedTabs options={FILTROS_CURSO} value={filtro} onChange={setFiltro} />
      </div>

      <div className="calbar">
        <div className="calnav">
          <button type="button" className="btn" onClick={() => c.moverMes(-1)} aria-label="Mes anterior">
            ‹
          </button>
          <b className="calmes">
            {MESES[c.mes.m]} {c.mes.y}
          </b>
          <button type="button" className="btn" onClick={() => c.moverMes(1)} aria-label="Mes siguiente">
            ›
          </button>
        </div>
        <CicloLegend items={LEYENDA} />
      </div>

      <MonthGrid y={c.mes.y} m={c.mes.m} eventosDe={eventosDe} onDayClick={g ? setAddDate : undefined} />

      {g && (
        <>
          <EventoForm fecha={addDate} onFecha={setAddDate} onAdd={c.addEvento} />
          <EventosList eventos={c.eventos} onDelete={c.delEvento} />
        </>
      )}
    </>
  );
}
