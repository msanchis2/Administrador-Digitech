import { Chip, SelectRow } from "@/components/ui";

export default function StepProfesor({ state, teachers, units, dispatch }) {
  const { colectivo, profesor, unit } = state;
  const pideAsignatura = colectivo === "Alumnado";
  const ready = profesor && (!pideAsignatura || unit);
  return (
    <>
      <h2>¿A qué profesor/a valoras?</h2>
      <SelectRow style={{ flexWrap: "wrap" }}>
        {teachers.map((t) => (
          <Chip key={t} selected={profesor === t} onClick={() => dispatch({ type: "profesor", value: t })}>
            {t}
          </Chip>
        ))}
      </SelectRow>
      {pideAsignatura && profesor && (
        <>
          <h3 style={{ marginTop: 14, fontSize: 14 }}>¿Qué asignatura te imparte?</h3>
          <SelectRow style={{ flexWrap: "wrap" }}>
            {units.map((u) => (
              <Chip
                key={`${u.asig}||${u.grado}`}
                selected={unit?.asig === u.asig && unit?.grado === u.grado}
                onClick={() => dispatch({ type: "unit", value: { asig: u.asig, grado: u.grado } })}
              >
                {u.asig} · {u.grado}
              </Chip>
            ))}
          </SelectRow>
        </>
      )}
      <div className="enc-nav">
        <button type="button" className="btn ghost" onClick={() => dispatch({ type: "step", value: 1 })}>
          Atrás
        </button>
        <button
          type="button"
          className="btn primary"
          disabled={!ready}
          onClick={() => dispatch({ type: "step", value: 3 })}
        >
          Siguiente
        </button>
      </div>
    </>
  );
}
