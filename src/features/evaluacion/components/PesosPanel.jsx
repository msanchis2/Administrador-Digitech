import { useState } from "react";
import { Field } from "@/components/ui";
import { WEIGHT_FIELDS } from "@/constants/encuesta";
import { useToast } from "@/context/ToastContext";
import { savePesos } from "@/services/encuesta";

const pc = (x) => Math.round(x * 100);

/** Panel plegable con la ponderación (editable solo por admin). */
export default function PesosPanel({ weights, onChange, editable }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const onSave = async () => {
    try {
      await savePesos(weights);
      toast("Ponderación guardada");
    } catch (e) {
      toast(`No se pudo guardar: ${e.message}`);
    }
  };

  return (
    <div className="fold">
      <button type="button" className="fold-h" onClick={() => setOpen(!open)} aria-expanded={open}>
        Ponderación {editable ? "(editable)" : "(solo lectura)"} {open ? "▴" : "▾"}
      </button>
      {open && (
        <div>
          <p className="muted" style={{ margin: "6px 0 10px" }}>
            El peso del alumnado en cada asignatura es el resto: 100 − familias − coordinación docente (ahora{" "}
            {100 - pc(weights.famGM) - pc(weights.coordDoc)}% en medio, {100 - pc(weights.famGS) - pc(weights.coordDoc)}
            % en superior).
          </p>
          <div className="row3">
            {WEIGHT_FIELDS.map(([key, label]) => (
              <Field key={key} label={label}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="number"
                    style={{ width: 70 }}
                    disabled={!editable}
                    value={pc(weights[key])}
                    onChange={(e) => onChange({ ...weights, [key]: (+e.target.value || 0) / 100 })}
                  />
                  <span>%</span>
                </div>
              </Field>
            ))}
          </div>
          {editable && (
            <button type="button" className="btn primary" style={{ marginTop: 10 }} onClick={onSave}>
              Guardar ponderación
            </button>
          )}
        </div>
      )}
    </div>
  );
}
