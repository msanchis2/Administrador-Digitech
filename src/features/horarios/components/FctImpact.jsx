import { profesoresLibresEnFct } from "@/utils/schedule";

/** Aviso del escenario «2º en FCT»: qué profesores se quedan sin carga. */
export default function FctImpact({ clases, fct }) {
  if (!fct) return null;
  const libres = profesoresLibresEnFct(clases);
  return (
    <div className="impact">
      Con <b>2º en FCT</b>, las horas de 2º (atenuadas) no se imparten.
      {libres.length > 0 && (
        <>
          {" "}
          Se quedan sin carga: <b>{libres.join(", ")}</b>.
        </>
      )}
    </div>
  );
}
