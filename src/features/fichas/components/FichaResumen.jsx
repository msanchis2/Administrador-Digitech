import { safeUrl } from "@/utils/format";
import Avatar from "./Avatar";

export default function FichaResumen({ ficha, carga }) {
  const { nombre, foto } = ficha;
  const linkedin = safeUrl(ficha.linkedin);
  const web = safeUrl(ficha.web);
  return (
    <div className="fsum">
      <div className="fsum-id">
        <Avatar nombre={nombre} foto={foto} />
        <div>
          <h3>{nombre}</h3>
          <span>{carga.centros.join(" · ") || "—"}</span>
          {(linkedin || web) && (
            <div className="plinks">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn ↗
                </a>
              )}
              {web && (
                <a href={web} target="_blank" rel="noopener noreferrer">
                  Web ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="fsum-stats">
        {[
          [carga.total, "horas"],
          [carga.h1, "de 1º"],
          [carga.h2, "de 2º"],
          [carga.clases.length, "clases"],
        ].map(([v, l]) => (
          <div key={l}>
            <b className="mono">{v}</b>
            <span>{l}</span>
          </div>
        ))}
      </div>
      <div className="fsum-cy">
        {carga.ciclos.map((x) => (
          <span key={x} className="cytag">
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}
