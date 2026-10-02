import { useState } from "react";
import { Card } from "@/components/ui";

export default function HabilitacionCard({ habilitacion, editable, onChange }) {
  const [nueva, setNueva] = useState("");

  const add = () => {
    const v = nueva.trim();
    if (!v) return;
    if (!habilitacion.includes(v)) onChange([...habilitacion, v]);
    setNueva("");
  };

  return (
    <Card title="Asignaturas que puede impartir">
      <div className="habs">
        {habilitacion.length ? (
          habilitacion.map((h) => (
            <span key={h} className="hab">
              {h}
              {editable && (
                <button type="button" title="Quitar" onClick={() => onChange(habilitacion.filter((x) => x !== h))}>
                  ✕
                </button>
              )}
            </span>
          ))
        ) : (
          <span className="muted">—</span>
        )}
      </div>
      {editable && (
        <div className="habadd">
          <input
            placeholder="Añadir asignatura…"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <button type="button" className="btn" onClick={add}>
            Añadir
          </button>
        </div>
      )}
    </Card>
  );
}
