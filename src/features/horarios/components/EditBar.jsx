import { useState } from "react";
import { useHorario } from "@/context/HorarioContext";
import { useToast } from "@/context/ToastContext";

/** Barra del modo edición: deshacer, guardar y salir (descartando si hace falta). */
export default function EditBar({ onExit }) {
  const { dirty, canUndo, undo, save, discard } = useHorario();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await save();
      toast("Horario guardado para todo el centro");
      onExit();
    } catch (e) {
      toast(`No se pudo guardar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const onSalir = () => {
    if (dirty && !window.confirm("Hay cambios sin guardar. ¿Descartarlos y salir del modo edición?")) return;
    if (dirty) discard();
    onExit();
  };

  return (
    <div className="editbar">
      <span className="editbar-title">
        ✏️ Modo edición
        <span className="muted">{dirty ? " · hay cambios sin guardar" : " · sin cambios"}</span>
      </span>
      <div className="editbar-actions">
        <button type="button" className="btn" onClick={undo} disabled={!canUndo}>
          Deshacer
        </button>
        <button type="button" className="btn primary" onClick={onSave} disabled={!dirty || saving}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        <button type="button" className="btn ghost" onClick={onSalir}>
          {dirty ? "Descartar y salir" : "Salir"}
        </button>
      </div>
    </div>
  );
}
