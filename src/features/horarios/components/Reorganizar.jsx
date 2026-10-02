import { useState } from "react";
import { SaveBar } from "@/components/ui";
import { useHorario } from "@/context/HorarioContext";
import { useToast } from "@/context/ToastContext";
import { SCHEDULE } from "@/data/schedule";
import { clone } from "@/utils/format";
import { busyOthers, compact, trySwap } from "@/utils/schedule";
import ClaseGrid from "./ClaseGrid";
import ClaseSelect from "./ClaseSelect";
import FctImpact from "./FctImpact";

const findClase = (clases, name) => clases.find((x) => x.clase === name);

/** Editor del horario de una clase: mover, intercambiar, cambiar profesor, compactar. */
export default function Reorganizar({ clases, fct, clase, onClase, profesores }) {
  const { mutate, undo, canUndo, dirty, save } = useHorario();
  const toast = useToast();
  const [picked, setPicked] = useState(null);
  const [saving, setSaving] = useState(false);

  const name = clase.clase;
  const pickedCell = picked ? clase.grid[picked.h][picked.d] : null;

  const onPick = ({ h, d }) => {
    if (picked && !(picked.h === h && picked.d === d)) {
      const res = mutate((next) => trySwap(next, findClase(next, name), picked, { h, d }));
      if (typeof res === "string") toast(res);
      else setPicked(null);
      return;
    }
    setPicked(picked ? null : { h, d });
  };

  const onDrop = ({ h, d }) => {
    if (!pickedCell || clase.grid[h][d]) return;
    if (busyOthers(clases, name)[d][h].has(pickedCell[1])) {
      toast(`${pickedCell[1]} ya imparte a esa hora en otra clase`);
      return;
    }
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

  const onUndo = () => {
    undo();
    setPicked(null);
  };

  const onChangeProf = (nuevo) => {
    if (!pickedCell || nuevo === pickedCell[1]) return;
    if (busyOthers(clases, name)[picked.d][picked.h].has(nuevo)) {
      toast(`${nuevo} ya imparte a esa hora en otra clase`);
      return;
    }
    mutate((next) => {
      findClase(next, name).grid[picked.h][picked.d][1] = nuevo;
    });
    toast(`Profesor cambiado a ${nuevo}`);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await save();
      toast("Horario guardado para todo el centro");
    } catch (e) {
      toast(`No se pudo guardar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <FctImpact clases={clases} fct={fct} />
      <ClaseSelect clases={clases} value={name} onChange={onClase} />
      <div className="htools">
        <button type="button" className="btn primary" onClick={onCompact}>
          Compactar
        </button>
        <button type="button" className="btn" onClick={onUndo} disabled={!canUndo}>
          Deshacer
        </button>
        <button type="button" className="btn" onClick={onReset}>
          Restablecer al original
        </button>
      </div>
      <p className="muted" style={{ margin: "-4px 0 12px" }}>
        {picked ? (
          <>
            Elige un <b>hueco verde</b> para mover la sesión, pulsa <b>otra sesión</b> para intercambiarlas, o cambia el
            profesor abajo.
          </>
        ) : (
          "Pulsa una sesión para moverla, intercambiarla o cambiarle el profesor."
        )}
      </p>
      {pickedCell && (
        <div className="reasign">
          Seleccionado: <b>{pickedCell[0]}</b> — profesor{" "}
          <select value={pickedCell[1]} onChange={(e) => onChangeProf(e.target.value)}>
            {profesores.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      )}
      <ClaseGrid clases={clases} cl={clase} fct={fct} editable picked={picked} onPick={onPick} onDrop={onDrop} />
      <SaveBar>
        <button type="button" className="btn primary" onClick={onSave} disabled={!dirty || saving}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        <span className="muted">{dirty ? "Hay cambios sin guardar" : "Todo guardado"}</span>
      </SaveBar>
    </>
  );
}
