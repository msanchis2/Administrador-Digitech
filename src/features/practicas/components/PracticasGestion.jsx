import { useMemo, useState } from "react";
import { Card, StatsRow } from "@/components/ui";
import { ESTADOS_PRACTICA } from "@/constants/practicas";
import { useToast } from "@/context/ToastContext";
import { SCHEDULE } from "@/data/schedule";
import { deletePractica, upsertPractica } from "@/services/practicas";
import { nowISO, rangoFechas } from "@/utils/format";
import { profesoresDe } from "@/utils/schedule";
import EstadoPill from "./EstadoPill";
import PracticaForm from "./PracticaForm";

function toRow(f) {
  const row = {
    id: f.id,
    alumno_id: f.alumno_id,
    empresa_id: f.empresa_id || null,
    fecha_inicio: f.fecha_inicio || null,
    fecha_fin: f.fecha_fin || null,
    horario: f.horario || null,
    horas: f.horas || null,
    tutor_centro: f.tutor_centro || null,
    tutor_empresa: f.tutor_empresa || null,
    estado: f.estado || "Sin empresa",
    doc: f.doc || {},
    observaciones: f.observaciones || null,
    actualizado: nowISO(),
  };
  if (!row.id) delete row.id;
  return row;
}

/** Vista de administración: estadísticas, filtros, listado y formulario. */
export default function PracticasGestion({ data }) {
  const { alumnos, empresas, list, alLabel, alGrupo, empDe, setList } = data;
  const toast = useToast();
  const [fGrupo, setFGrupo] = useState("");
  const [fEstado, setFEstado] = useState("");
  const [editando, setEditando] = useState(null);
  const teachers = useMemo(() => profesoresDe(SCHEDULE.clases), []);

  const grupos = [...new Set(alumnos.map((a) => a.grupo))].sort();
  const filtradas = list
    .filter((p) => (!fGrupo || alGrupo(p.alumno_id) === fGrupo) && (!fEstado || p.estado === fEstado))
    .sort((a, b) => alLabel(a.alumno_id).localeCompare(alLabel(b.alumno_id)));

  const count = (fn) => list.filter(fn).length;
  const stats = [
    ["prácticas", list.length],
    ["sin empresa", count((p) => !p.empresa_id || p.estado === "Sin empresa")],
    ["convenio pdte.", count((p) => p.estado === "Convenio pendiente")],
    ["en curso", count((p) => p.estado === "En curso")],
    ["finalizadas", count((p) => p.estado === "Finalizada")],
  ];

  const onSave = async (f) => {
    if (!f.alumno_id) return toast("Elige un alumno");
    try {
      const saved = await upsertPractica(toRow(f));
      setList((l) => [...l.filter((x) => x.id !== saved.id), saved]);
      setEditando(saved);
      toast("Práctica guardada");
    } catch (e) {
      toast(`No se pudo guardar: ${e.message}`);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta práctica?")) return;
    try {
      await deletePractica(id);
      setList((l) => l.filter((x) => x.id !== id));
      setEditando(null);
      toast("Eliminada");
    } catch (e) {
      toast(`No se pudo: ${e.message}`);
    }
  };

  return (
    <>
      <StatsRow items={stats} />
      <div className="hbar">
        <div className="hselrow" style={{ margin: 0 }}>
          <select value={fGrupo} onChange={(e) => setFGrupo(e.target.value)}>
            <option value="">Todos los grupos</option>
            {grupos.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <select value={fEstado} onChange={(e) => setFEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {ESTADOS_PRACTICA.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>
        <button type="button" className="btn primary" onClick={() => setEditando({ estado: "Sin empresa", doc: {} })}>
          ＋ Nueva práctica
        </button>
      </div>

      <Card style={{ padding: "6px 0" }}>
        <table>
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Grupo</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Fechas</th>
              <th>Tutor</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length ? (
              filtradas.map((p) => (
                <tr key={p.id} className="rowlink" onClick={() => setEditando(p)}>
                  <td style={{ fontWeight: 600 }}>{alLabel(p.alumno_id)}</td>
                  <td>{alGrupo(p.alumno_id)}</td>
                  <td>{empDe(p.empresa_id)?.nombre || "—"}</td>
                  <td>
                    <EstadoPill estado={p.estado} />
                  </td>
                  <td className="mono" style={{ fontSize: 11 }}>
                    {rangoFechas(p.fecha_inicio, p.fecha_fin)}
                  </td>
                  <td>{p.tutor_centro || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="muted" style={{ padding: 14 }}>
                  No hay prácticas con ese filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {editando && (
        <PracticaForm
          key={editando.id || "new"}
          practica={editando}
          alumnos={alumnos}
          empresas={empresas}
          teachers={teachers}
          alLabel={alLabel}
          onSave={onSave}
          onDelete={onDelete}
          onClose={() => setEditando(null)}
        />
      )}
    </>
  );
}
