import { Card } from "@/components/ui";
import { rangoFechas } from "@/utils/format";
import EstadoPill from "./EstadoPill";

const Dato = ({ label, children }) => (
  <div>
    <span className="muted">{label}</span>
    <br />
    {children}
  </div>
);

/** Vista del profesorado: solo las prácticas que tutoriza. */
export default function PracticasTutor({ data, docente }) {
  const { list, alLabel, alGrupo, empDe } = data;
  const mias = list.filter((p) => p.tutor_centro === docente);

  return (
    <>
      <Card title="Seguimiento de tus prácticas">
        <p className="muted">
          Prácticas en las que eres tutor de centro. La gestión documental la lleva administración.
        </p>
      </Card>
      {mias.length ? (
        mias.map((p) => {
          const e = empDe(p.empresa_id);
          return (
            <Card key={p.id}>
              <div className="tutor-head">
                <h2 style={{ margin: 0 }}>
                  {alLabel(p.alumno_id)}{" "}
                  <span className="muted" style={{ fontWeight: 400 }}>
                    · {alGrupo(p.alumno_id)}
                  </span>
                </h2>
                <EstadoPill estado={p.estado} />
              </div>
              <div className="row3" style={{ marginTop: 10 }}>
                <Dato label="Empresa">
                  <b>{e ? e.nombre : "— sin asignar"}</b>
                </Dato>
                <Dato label="Fechas">{rangoFechas(p.fecha_inicio, p.fecha_fin)}</Dato>
                <Dato label="Horas">
                  {p.horas || "—"}
                  {p.horario && ` · ${p.horario}`}
                </Dato>
                {e && (
                  <Dato label="Contacto empresa">
                    {e.contacto_nombre || "—"}
                    {e.contacto_tel && ` · ${e.contacto_tel}`}
                    {e.contacto_email && ` · ${e.contacto_email}`}
                  </Dato>
                )}
                <Dato label="Tutor empresa">{p.tutor_empresa || "—"}</Dato>
                {p.observaciones && <Dato label="Observaciones">{p.observaciones}</Dato>}
              </div>
            </Card>
          );
        })
      ) : (
        <Card>
          <p className="muted">
            No tienes prácticas asignadas como tutor. Cuando administración te asigne alumnos, aparecerán aquí.
          </p>
        </Card>
      )}
    </>
  );
}
