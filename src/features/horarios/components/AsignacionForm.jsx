import { useMemo, useState } from "react";
import { Card, Field, Message } from "@/components/ui";
import { cargaProfesor, huecosCompatibles, validarAsignacion } from "@/utils/asignaciones";

/** Alta de una asignatura a un profesor en un grupo, con validación en vivo. */
export default function AsignacionForm({ clases, bloqueos, profesores, asignaturas, profInicial, onAdd }) {
  const [prof, setProf] = useState(profInicial || profesores[0]);
  const [clase, setClase] = useState(clases[0].clase);
  const [asig, setAsig] = useState("");
  const [horas, setHoras] = useState(2);

  const datos = { prof, clase, asig, horas: Number(horas) };
  const error = validarAsignacion(clases, bloqueos, datos);
  const info = useMemo(() => {
    if (!prof || !clase) return null;
    const { libres } = cargaProfesor(clases, bloqueos, prof);
    return { libres, huecos: huecosCompatibles(clases, bloqueos, clase, prof).length };
  }, [clases, bloqueos, prof, clase]);

  const submit = () => {
    if (error) return;
    if (onAdd({ ...datos, asig: asig.trim() })) setAsig("");
  };

  return (
    <Card title="Asignar asignatura">
      <div className="row3 row4">
        <Field label="Profesor/a">
          <select value={prof} onChange={(e) => setProf(e.target.value)}>
            {profesores.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Grupo">
          <select value={clase} onChange={(e) => setClase(e.target.value)}>
            {clases.map((c) => (
              <option key={c.clase}>{c.clase}</option>
            ))}
          </select>
        </Field>
        <Field label="Asignatura">
          <input
            list="asignaturas-conocidas"
            placeholder="p. ej. Redes locales"
            value={asig}
            onChange={(e) => setAsig(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <datalist id="asignaturas-conocidas">
            {asignaturas.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </Field>
        <Field label="Horas / semana">
          <input type="number" min={1} max={30} value={horas} onChange={(e) => setHoras(e.target.value)} />
        </Field>
      </div>
      <div className="asig-foot">
        {info && (
          <span className="muted">
            {prof}: <b>{info.libres}</b> h libres · franjas en que coinciden libres {prof} y {clase}:{" "}
            <b>{info.huecos}</b>
          </span>
        )}
        <button type="button" className="btn primary" onClick={submit} disabled={!!error}>
          Añadir y colocar en el horario
        </button>
      </div>
      {error && asig.trim() && <Message variant="warn">{error}</Message>}
    </Card>
  );
}
