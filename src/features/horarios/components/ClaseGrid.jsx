import WeekGrid from "@/components/schedule/WeekGrid";
import { busyOthers, cicloDe, cursoDe, gapsOf, profCol } from "@/utils/schedule";
import SessionCell from "./SessionCell";

/**
 * Horario de una clase. En modo `editable` muestra huecos y, si hay una sesión
 * seleccionada (`picked`), las casillas libres donde puede moverse.
 */
export default function ClaseGrid({ clases, cl, fct, editable = false, picked, onPick, onDrop }) {
  const ciclo = cicloDe(cl.clase);
  const dim = fct && cursoDe(cl) === 2;
  const gaps = editable ? gapsOf(cl) : null;
  const src = picked ? cl.grid[picked.h][picked.d] : null;
  const busy = editable && src ? busyOthers(clases, cl.clase) : null;

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
          const conflict = busy[d][h].has(src[1]);
          cls += conflict ? " no" : " ok";
          label = conflict ? "ocupado" : "mover aquí";
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
