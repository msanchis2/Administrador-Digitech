import { useState } from "react";
import { Card, Field } from "@/components/ui";
import { FILTROS_CURSO, TIPO_CAL } from "@/constants/calendario";
import { useToast } from "@/context/ToastContext";

/** Alta de festivos/eventos. `fecha` se puede rellenar desde fuera pulsando un día. */
export default function EventoForm({ fecha, onFecha, onAdd }) {
  const toast = useToast();
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("festivo");
  const [aplica, setAplica] = useState("ambos");

  const add = async () => {
    if (!fecha) return toast("Pon una fecha");
    try {
      await onAdd({ fecha, titulo: titulo.trim() || null, tipo, aplica });
      onFecha("");
      setTitulo("");
      toast("Añadido");
    } catch (e) {
      toast(`No se pudo: ${e.message}`);
    }
  };

  return (
    <Card title="Añadir festivo o evento">
      <div className="row3">
        <Field label="Fecha">
          <input type="date" value={fecha} onChange={(e) => onFecha(e.target.value)} />
        </Field>
        <Field label="Título">
          <input placeholder="p. ej. Fin de clases 2º" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </Field>
        <Field label="Tipo">
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {Object.entries(TIPO_CAL).map(([k, t]) => (
              <option key={k} value={k}>
                {t[2]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Aplica a">
          <select value={aplica} onChange={(e) => setAplica(e.target.value)}>
            {FILTROS_CURSO.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <Field style={{ alignSelf: "end" }}>
          <button type="button" className="btn primary btn-block" onClick={add}>
            Añadir
          </button>
        </Field>
      </div>
    </Card>
  );
}
