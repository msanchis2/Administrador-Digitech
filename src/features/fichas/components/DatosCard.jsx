import { Card, Field } from "@/components/ui";
import { CARGOS, IDONEIDADES } from "@/constants/roles";

/** Datos académicos (los edita el propio docente) y de gestión (idoneidad, cargo). */
export default function DatosCard({ ficha, editPersonal, editGestion, onChange }) {
  const input = (key, label, props = {}) => (
    <Field label={label}>
      <input
        value={ficha[key]}
        disabled={!editPersonal}
        onChange={(e) => onChange({ [key]: e.target.value })}
        {...props}
      />
    </Field>
  );
  return (
    <Card title="Datos">
      <div className="row3">
        {input("titulacion", "Titulación", { placeholder: "p. ej. Ing. Informática" })}
        {input("experiencia", "Experiencia (años)", { type: "number" })}
        {input("edad", "Edad", { type: "number" })}
        <Field label="Idoneidad de grado">
          <select
            value={ficha.idoneidad}
            disabled={!editGestion}
            onChange={(e) => onChange({ idoneidad: e.target.value })}
          >
            <option value="">—</option>
            {IDONEIDADES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </Field>
        <Field label="Cargo">
          <select
            value={ficha.cargo_tipo}
            disabled={!editGestion}
            onChange={(e) => onChange({ cargo_tipo: e.target.value })}
          >
            {CARGOS.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        {ficha.cargo_tipo !== "ninguno" && (
          <Field label="Detalle del cargo">
            <input
              value={ficha.cargo_detalle}
              placeholder="p. ej. Tutoría 1º DAW"
              disabled={!editGestion}
              onChange={(e) => onChange({ cargo_detalle: e.target.value })}
            />
          </Field>
        )}
      </div>
      <p className="muted" style={{ marginTop: 8 }}>
        Titulación, experiencia y edad las edita el propio profesor. Idoneidad y cargo, el equipo de gestión.
      </p>
    </Card>
  );
}
