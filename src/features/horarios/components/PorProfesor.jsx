import { useMemo } from "react";
import WeekGrid from "@/components/schedule/WeekGrid";
import { SelectRow } from "@/components/ui";
import { cicloDe, cursoDe, emptyDayHourMap, forEachSession } from "@/utils/schedule";
import FctImpact from "./FctImpact";
import SessionCell from "./SessionCell";

export default function PorProfesor({ clases, fct, profesores, prof, onProf }) {
  const cells = useMemo(() => {
    const m = emptyDayHourMap(() => null);
    forEachSession(clases, (cell, cl, h, d) => {
      if (cell[1] === prof) m[d][h] = { asig: cell[0], clase: cl.clase, curso: cursoDe(cl) };
    });
    return m;
  }, [clases, prof]);

  return (
    <>
      <FctImpact clases={clases} fct={fct} />
      <SelectRow label="Profesor/a">
        <select value={prof} onChange={(e) => onProf(e.target.value)}>
          {profesores.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </SelectRow>
      <WeekGrid
        renderCell={(h, d) => {
          const v = cells[d][h];
          if (!v) return <div className="hslot" />;
          const ciclo = cicloDe(v.clase);
          return (
            <SessionCell
              ciclo={ciclo}
              title={v.asig}
              subtitle={v.clase}
              subtitleColor={ciclo.c}
              dim={fct && v.curso === 2}
            />
          );
        }}
      />
    </>
  );
}
