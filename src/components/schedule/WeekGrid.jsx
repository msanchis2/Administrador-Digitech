import { Fragment } from "react";
import { DIAS, HORAS, PERIOD_TIME, RECREO_ANTES_DE, RECREO_LABEL } from "@/data/schedule";

/**
 * Rejilla semanal (días × horas) con la franja del recreo.
 * `renderCell(hora, dia)` devuelve el contenido de cada casilla.
 */
export default function WeekGrid({ renderCell, style }) {
  return (
    // El contenedor permite desplazar la rejilla en horizontal en pantallas estrechas.
    <div className="hgrid-scroll" style={style}>
      <div className="hgrid">
        <div className="hhead" />
        {DIAS.map((d) => (
          <div key={d} className="hhead">
            {d}
          </div>
        ))}
        {HORAS.map((h, hi) => (
          <Fragment key={h}>
            {hi === RECREO_ANTES_DE && <div className="hrecreo">{RECREO_LABEL}</div>}
            <div className="htime">
              <b>{h}</b>
              <span>{PERIOD_TIME[h]}</span>
            </div>
            {DIAS.map((d) => (
              <Fragment key={d}>{renderCell(h, d)}</Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
