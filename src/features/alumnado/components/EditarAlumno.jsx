import { useState } from "react";
import { Card, Field, SaveBar } from "@/components/ui";
import { CAMPOS_ALUMNO, DOCS_ALUMNO, ESTADOS_DOC_ALUMNO } from "@/constants/alumnado";
import { useToast } from "@/context/ToastContext";
import { updateAlumno } from "@/services/alumnos";

/** Formulario de un alumno. Montar con `key={alumno.id}`. */
export default function EditarAlumno({ alumno, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(() => ({
    ...Object.fromEntries(CAMPOS_ALUMNO.map(([k]) => [k, alumno[k] || ""])),
    documentos: { ...(alumno.documentos || {}) },
  }));

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setDoc = (k, v) => setForm((f) => ({ ...f, documentos: { ...f.documentos, [k]: v } }));

  const onSave = async () => {
    const row = Object.fromEntries(CAMPOS_ALUMNO.map(([k]) => [k, form[k] || null]));
    row.documentos = form.documentos;
    try {
      await updateAlumno(alumno.id, row);
      toast("Alumno guardado");
      onSaved();
    } catch (e) {
      toast(`No se pudo guardar: ${e.message}`);
    }
  };

  return (
    <Card title="Editar alumno">
      <div className="row3">
        {CAMPOS_ALUMNO.map(([k, label, type = "text", span = 1]) => (
          <Field key={k} label={label} style={span > 1 ? { gridColumn: `span ${span}` } : undefined}>
            <input type={type} value={form[k]} onChange={(e) => set(k, e.target.value)} />
          </Field>
        ))}
      </div>
      <h3 className="subhead">Documentación</h3>
      <div className="row3">
        {DOCS_ALUMNO.map(([k, l]) => (
          <Field key={k} label={l}>
            <select value={form.documentos[k] || "Pendiente"} onChange={(e) => setDoc(k, e.target.value)}>
              {ESTADOS_DOC_ALUMNO.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        ))}
      </div>
      <SaveBar>
        <button type="button" className="btn primary" onClick={onSave}>
          Guardar alumno
        </button>
        <button type="button" className="btn ghost" onClick={onClose}>
          Cerrar
        </button>
      </SaveBar>
    </Card>
  );
}
