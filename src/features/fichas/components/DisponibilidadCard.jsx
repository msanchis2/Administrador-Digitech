import WeekGrid from "@/components/schedule/WeekGrid";
import { Card } from "@/components/ui";

const slotKey = (d, h) => `${d}|${h}`;

export default function DisponibilidadCard({ bloqueos, editable, onChange }) {
  const toggle = (d, h) => {
    const next = { ...bloqueos };
    const k = slotKey(d, h);
    if (next[k]) delete next[k];
    else next[k] = true;
    onChange(next);
  };

  return (
    <Card title="Disponibilidad horaria">
      <p className="muted">
        {editable ? (
          <>
            Pulsa una casilla para marcarla como <b>no disponible</b>. Verde = disponible.
          </>
        ) : (
          "Verde = disponible; rojo = no disponible."
        )}
      </p>
      <WeekGrid
        style={{ marginTop: 10 }}
        renderCell={(h, d) => {
          const off = bloqueos[slotKey(d, h)];
          return (
            <button
              type="button"
              className={`avail ${off ? "off" : "on"}`}
              disabled={!editable}
              onClick={() => toggle(d, h)}
            >
              {off ? "no disp." : ""}
            </button>
          );
        }}
      />
    </Card>
  );
}
