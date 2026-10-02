import { COLECTIVOS } from "@/constants/encuesta";
import { gradeHint } from "@/utils/evaluacion";
import { r0 } from "@/utils/format";

/** Tarjeta oscura con las notas de un profesor. */
export default function ResultadoBox({ nombre, v }) {
  const hint = gradeHint(v.porGrado);
  const best = v.unidades.slice().sort((a, b) => b.nota - a.nota);
  return (
    <div className="resbox">
      <div className="resnums">
        <div className="big">
          <b className="mono">{r0(v.global)}</b>
          <span>Global</span>
        </div>
        <div>
          <b className="mono">{r0(v.docente)}</b>
          <span>Docente</span>
        </div>
        <div>
          <b className="mono">{r0(v.profesional)}</b>
          <span>Profesional</span>
        </div>
      </div>

      {Object.keys(v.porGrado).length > 0 && (
        <div className="resgr">
          {Object.entries(v.porGrado).map(([g, x]) => (
            <div key={g}>
              <span>{g}</span>
              <b className="mono">{r0(x)}</b>
            </div>
          ))}
        </div>
      )}

      {hint && <p className="reshint">{hint}</p>}

      {best.length ? (
        <div className="restab">
          <div className="restab-h">Por asignatura</div>
          {best.map((u) => (
            <div key={`${u.asig}||${u.grado}`} className="restab-row">
              <span>
                {u.asig} <em>{u.grado}</em>
              </span>
              <div className="minibar">
                <span style={{ width: `${u.nota}%` }} />
              </div>
              <b className="mono">{r0(u.nota)}</b>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">Aún no hay respuestas de alumnado para calcular la docencia de {nombre}.</p>
      )}

      <div className="counts">
        {COLECTIVOS.map((c) => (
          <span key={c}>
            {c}: <b>{v.counts[c] || 0}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
