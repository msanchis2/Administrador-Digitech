import { useState } from "react";
import { Card, Field, SaveBar, TextArea } from "@/components/ui";
import { CICLOS_KEYS } from "@/constants/ciclos";
import { EMP_FIELDS, EMP_SECCIONES } from "@/constants/empresas";

/** Alta/edición de empresa. Montar con `key` para reiniciar al cambiar de empresa. */
export default function EmpresaForm({ empresa, onSave, onDelete, onClose }) {
  const isNew = !empresa.id;
  const [f, setF] = useState(() => ({ ...empresa, ciclos: empresa.ciclos || [] }));
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  const toggleCiclo = (c, on) => set("ciclos", on ? [...f.ciclos, c] : f.ciclos.filter((x) => x !== c));

  return (
    <Card title={isNew ? "Nueva empresa" : f.nombre || "Empresa"}>
      {EMP_SECCIONES.map(([sec, titulo], i) => (
        <div key={sec}>
          <h3 className="subhead" style={i === 0 ? { marginTop: 8 } : undefined}>
            {titulo}
          </h3>
          <div className="row3">
            {EMP_FIELDS.filter((x) => x[2] === sec).map(([id, label]) => (
              <Field key={id} label={label}>
                <input value={f[id] || ""} onChange={(e) => set(id, e.target.value)} />
              </Field>
            ))}
          </div>
        </div>
      ))}

      <h3 className="subhead">Gestión</h3>
      <div style={{ marginBottom: 10 }}>
        {CICLOS_KEYS.map((c) => (
          <label key={c} className="checkline">
            <input type="checkbox" checked={f.ciclos.includes(c)} onChange={(e) => toggleCiclo(c, e.target.checked)} />{" "}
            {c}
          </label>
        ))}
      </div>
      <div className="row3">
        <Field label="Máx. alumnos">
          <input type="number" value={f.max_alumnos || ""} onChange={(e) => set("max_alumnos", e.target.value)} />
        </Field>
        <Field label="Valoración interna">
          <select
            value={f.valoracion ?? ""}
            onChange={(e) => set("valoracion", e.target.value ? parseInt(e.target.value, 10) : null)}
          >
            <option value="">—</option>
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Observaciones">
        <TextArea minHeight={60} value={f.observaciones || ""} onChange={(e) => set("observaciones", e.target.value)} />
      </Field>
      <SaveBar>
        <button type="button" className="btn primary" onClick={() => onSave(f)}>
          Guardar empresa
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
