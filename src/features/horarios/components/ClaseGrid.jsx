import WeekGrid from "@/components/schedule/WeekGrid";
import { motivoNoCabe } from "@/utils/asignaciones";
import { cicloDe, cursoDe, gapsOf, profCol } from "@/utils/schedule";
import SessionCell from "./SessionCell";

/**
 * Horario de una clase. En modo `editable` muestra los huecos y, si hay una
 * sesión seleccionada (`picked`), en qué casillas libres puede colocarse.
 */
export default function ClaseGrid({ clases, bloqueos, cl, fct, editable = false, picked, onPick, onDrop }) {
  const ciclo = cicloDe(cl.clase);
  const dim = fct && cursoDe(cl) === 2;
  const gaps = editable ? gapsOf(cl) : null;
  const src = picked ? cl.grid[picked.h][picked.d] : null;

  return (
    <WeekGrid
      renderCell={(h, d) => {
        const cell = cl.grid[h][d];
        if (cell) {
          return (
            <SessionCell
              ciclo={ciclo}
              title={cell[0]}
              subtitle={cell[1]}
              subtitleColor={profCol(cell[1])}
              dim={dim}
              picked={picked && picked.h === h && picked.d === d}
              onClick={editable ? () => onPick({ h, d }) : undefined}
            />
          );
        }
        if (!editable) return <div className="hslot" />;

        let cls = "hslot";
        let label = "";
        if (src) {
          const motivo = motivoNoCabe(clases, bloqueos, cl.clase, src[1], h, d, picked);
          cls += motivo ? " no" : " ok";
          label = motivo || "mover aquí";
        } else if (gaps[d].has(h)) {
          cls += " gap";
          label = "hueco";
        }
        return (
          <button type="button" className={cls} onClick={() => onDrop({ h, d })}>
            {label}
          </button>
        );
      }}
    />
  );
}
