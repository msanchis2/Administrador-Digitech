import { useState } from "react";
import { useHorario } from "@/context/HorarioContext";
import { useToast } from "@/context/ToastContext";
import { SCHEDULE } from "@/data/schedule";
import { motivoNoCabe } from "@/utils/asignaciones";
import { clone } from "@/utils/format";
import { compact, trySwap } from "@/utils/schedule";
import ClaseGrid from "./ClaseGrid";

const findClase = (clases, name) => clases.find((x) => x.clase === name);

/** Edición del horario de un grupo: mover a huecos libres, intercambiar, compactar y restablecer. */
export default function ClaseEditor({ clases, bloqueos, fct, clase }) {
  const { mutate } = useHorario();
  const toast = useToast();
  const [picked, setPicked] = useState(null);

  const name = clase.clase;
  const pickedCell = picked ? clase.grid[picked.h][picked.d] : null;

  const onPick = ({ h, d }) => {
    if (picked && !(picked.h === h && picked.d === d)) {
      const res = mutate((next) => trySwap(next, findClase(next, name), picked, { h, d }, bloqueos));
      if (typeof res === "string") toast(res);
      else setPicked(null);
      return;
    }
    setPicked(picked ? null : { h, d });
  };

  const onDrop = ({ h, d }) => {
    if (!pickedCell) return;
    const motivo = motivoNoCabe(clases, bloqueos, name, pickedCell[1], h, d, picked);
    if (motivo) return toast(`No se puede mover ahí: ${motivo}`);
    mutate((next) => {
      const cl = findClase(next, name);
      cl.grid[h][d] = cl.grid[picked.h][picked.d];
      cl.grid[picked.h][picked.d] = null;
    });
    setPicked(null);
  };

  const onCompact = () => {
    const res = mutate((next) => {
      const before = JSON.stringify(findClase(next, name).grid);
      compact(next, name);
      return JSON.stringify(findClase(next, name).grid) !== before;
    });
    setPicked(null);
    toast(res ? "Clase compactada" : "Ya estaba compactada; sin cambios");
  };

  const onReset = () => {
    const msg = `¿Restablecer ${name} al horario original de los Excel? Se perderán los cambios de esta clase que no hayas guardado.`;
    const orig = findClase(SCHEDULE.clases, name);
    if (!orig || !window.confirm(msg)) return;
    mutate((next) => {
      findClase(next, name).grid = clone(orig.grid);
    });
    setPicked(null);
    toast("Clase restablecida al original");
  };

  return (
    <>
      <div className="htools">
        <button type="button" className="btn" onClick={onCompact}>
          Compactar
        </button>
        <button type="button" className="btn" onClick={onReset}>
          Restablecer al original
        </button>
      </div>
      <p className="muted" style={{ margin: "-4px 0 12px" }}>
        {pickedCell ? (
          <>
            <b>{pickedCell[0]}</b> ({pickedCell[1]}) seleccionada. Elige un <b>hueco verde</b> para moverla o pulsa{" "}
            <b>otra sesión</b> para intercambiarlas.
          </>
        ) : (
          "Pulsa una sesión para moverla a un hueco libre o intercambiarla con otra."
        )}
      </p>
      <ClaseGrid
        clases={clases}
        bloqueos={bloqueos}
        cl={clase}
        fct={fct}
        editable
        picked={picked}
        onPick={onPick}
        onDrop={onDrop}
      />
    </>
  );
}
