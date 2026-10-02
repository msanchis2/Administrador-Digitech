import { useState } from "react";
import { Card, Field, SaveBar, TextArea } from "@/components/ui";
import { DOC_ESTADOS_PRACTICA, DOCS_PRACTICA, ESTADOS_PRACTICA, HORAS_PRESET } from "@/constants/practicas";

/** Alta/edición de una práctica. Montar con `key` por práctica. */
export default function PracticaForm({ practica, alumnos, empresas, teachers, alLabel, onSave, onDelete, onClose }) {
  const isNew = !practica.id;
  const [f, setF] = useState(() => ({ ...practica, doc: practica.doc || {} }));
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  const alumnosOrd = alumnos.slice().sort((a, b) => (a.grupo + alLabel(a.id)).localeCompare(b.grupo + alLabel(b.id)));

  const onEmpresa = (id) =>
    setF((x) => ({
      ...x,
      empresa_id: id || null,
      // Asignar empresa a una práctica «Sin empresa» avanza su estado automáticamente.
      estado: id && x.estado === "Sin empresa" ? "Empresa asignada" : x.estado,
    }));

  return (
    <Card title={isNew ? "Nueva práctica" : `Práctica · ${alLabel(f.alumno_id)}`}>
      <div className="row3">
        <Field label="Alumno">
          <select value={f.alumno_id || ""} onChange={(e) => set("alumno_id", e.target.value || null)}>
            <option value="">—</option>
            {alumnosOrd.map((a) => (
              <option key={a.id} value={a.id}>
                {a.apellidos || ""}, {a.nombre || ""} · {a.grupo}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Empresa">
          <select value={f.empresa_id || ""} onChange={(e) => onEmpresa(e.target.value)}>
            <option value="">— (sin asignar)</option>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estado">
          <select value={f.estado} onChange={(e) => set("estado", e.target.value)}>
            {ESTADOS_PRACTICA.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </Field>
        <Field label="Fecha inicio">
          <input type="date" value={f.fecha_inicio || ""} onChange={(e) => set("fecha_inicio", e.target.value)} />
        </Field>
        <Field label="Fecha fin">
          <input type="date" value={f.fecha_fin || ""} onChange={(e) => set("fecha_fin", e.target.value)} />
        </Field>
        <Field label="Horas">
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <input
              type="number"
              style={{ width: 80 }}
              value={f.horas ?? ""}
              onChange={(e) => set("horas", e.target.value ? parseInt(e.target.value, 10) : null)}
            />
            {HORAS_PRESET.map((h) => (
              <button type="button" key={h} className="btn" onClick={() => set("horas", h)}>
                {h}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Horario">
          <input
            placeholder="p. ej. 9:00–14:00"
            value={f.horario || ""}
            onChange={(e) => set("horario", e.target.value)}
          />
        </Field>
        <Field label="Tutor de centro">
          <select value={f.tutor_centro || ""} onChange={(e) => set("tutor_centro", e.target.value || null)}>
            <option value="">—</option>
            {teachers.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Tutor de empresa">
          <input value={f.tutor_empresa || ""} onChange={(e) => set("tutor_empresa", e.target.value)} />
        </Field>
      </div>

      <h3 className="subhead">Documentación (solo estado)</h3>
      <div className="row3">
        {DOCS_PRACTICA.map(([k, l]) => (
          <Field key={k} label={l}>
            <select value={f.doc[k] || "No generado"} onChange={(e) => set("doc", { ...f.doc, [k]: e.target.value })}>
              {DOC_ESTADOS_PRACTICA.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        ))}
      </div>

      <Field label="Observaciones" style={{ marginTop: 10 }}>
        <TextArea minHeight={56} value={f.observaciones || ""} onChange={(e) => set("observaciones", e.target.value)} />
      </Field>

      <SaveBar>
        <button type="button" className="btn primary" onClick={() => onSave(f)}>
          Guardar práctica
        </button>
        {!isNew && (
          <button type="button" className="btn ghost" onClick={() => onDelete(f.id)}>
            Eliminar
          </button>
        )}
        <button type="button" className="btn ghost" onClick={onClose}>
          Cerrar
        </button>
      </SaveBar>
    </Card>
  );
}
