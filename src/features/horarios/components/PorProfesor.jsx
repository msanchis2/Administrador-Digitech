import { useMemo, useState } from "react";
import WeekGrid from "@/components/schedule/WeekGrid";
import { SelectRow } from "@/components/ui";
import { useHorario } from "@/context/HorarioContext";
import { useToast } from "@/context/ToastContext";
import { motivoNoCabe } from "@/utils/asignaciones";
import { cicloDe, cursoDe, emptyDayHourMap, forEachSession } from "@/utils/schedule";
import FctImpact from "./FctImpact";
import SessionCell from "./SessionCell";

/** Horario de un profesor. En modo edición sus sesiones se pueden mover a franjas libres. */
export default function PorProfesor({ clases, bloqueos, fct, profesores, prof, onProf, editing }) {
  const { mutate } = useHorario();
  const toast = useToast();
  const [picked, setPicked] = useState(null); // {h, d, clase}

  const cells = useMemo(() => {
    const m = emptyDayHourMap(() => null);
    forEachSession(clases, (cell, cl, h, d) => {
      if (cell[1] === prof) m[d][h] = { asig: cell[0], clase: cl.clase, curso: cursoDe(cl) };
    });
    return m;
  }, [clases, prof]);

  const sel = picked && cells[picked.d][picked.h];

  const onPick = (h, d) => setPicked(picked && picked.h === h && picked.d === d ? null : { h, d });

  const onDrop = (h, d) => {
    if (!sel) return;
    const motivo = motivoNoCabe(clases, bloqueos, sel.clase, prof, h, d, picked);
    if (motivo)
      return toast(`No se puede mover ahí: ${motivo === "grupo ocupado" ? `${sel.clase} ya tiene clase` : motivo}`);
    mutate((next) => {
      const cl = next.find((c) => c.clase === sel.clase);
      cl.grid[h][d] = cl.grid[picked.h][picked.d];
      cl.grid[picked.h][picked.d] = null;
    });
    setPicked(null);
  };

  return (
    <>
      <FctImpact clases={clases} fct={fct} />
      <SelectRow label="Profesor/a">
        <select
          value={prof}
          onChange={(e) => {
            setPicked(null);
            onProf(e.target.value);
          }}
        >
          {profesores.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </SelectRow>
      {editing && (
        <p className="muted" style={{ margin: "-4px 0 12px" }}>
          {sel ? (
            <>
              <b>{sel.asig}</b> en {sel.clase} seleccionada. Las casillas verdes son franjas en las que {prof} y{" "}
              {sel.clase} están libres a la vez.
            </>
          ) : (
            "Pulsa una sesión para moverla a otra franja libre."
          )}
        </p>
      )}
      <WeekGrid
        renderCell={(h, d) => {
          const v = cells[d][h];
          if (v) {
            const ciclo = cicloDe(v.clase);
            return (
              <SessionCell
                ciclo={ciclo}
                title={v.asig}
                subtitle={v.clase}
                subtitleColor={ciclo.c}
                dim={fct && v.curso === 2}
                picked={picked && picked.h === h && picked.d === d}
                onClick={editing ? () => onPick(h, d) : undefined}
              />
            );
          }
          const bloqueado = !!bloqueos[prof]?.[`${d}|${h}`];
          if (!editing) return <div className={`hslot${bloqueado ? " blocked" : ""}`} />;
          let cls = "hslot";
          let label = "";
          if (sel) {
            const motivo = motivoNoCabe(clases, bloqueos, sel.clase, prof, h, d, picked);
            cls += motivo ? " no" : " ok";
            label = motivo === "grupo ocupado" ? "grupo ocupado" : motivo || "mover aquí";
          } else if (bloqueado) {
            cls += " blocked";
            label = "no disp.";
          }
          return (
            <button type="button" className={cls} onClick={() => onDrop(h, d)}>
              {label}
            </button>
          );
        }}
      />
    </>
  );
}
