import { Card } from "@/components/ui";
import { aplicaLabel, TIPO_CAL } from "@/constants/calendario";
import { useToast } from "@/context/ToastContext";
import { eventoLabel } from "../eventoLabel";

export default function EventosList({ eventos, onDelete }) {
  const toast = useToast();
  const ordenados = eventos.slice().sort((a, b) => a.fecha.localeCompare(b.fecha));

  const quitar = async (id) => {
    if (!window.confirm("¿Quitar este evento?")) return;
    try {
      await onDelete(id);
    } catch (e) {
      toast(`No se pudo: ${e.message}`);
    }
  };

  return (
    <Card title={`Todo el curso (${eventos.length})`}>
      {ordenados.length ? (
        <table>
          <tbody>
            {ordenados.map((e) => {
              const t = TIPO_CAL[e.tipo] || TIPO_CAL.evento;
              return (
                <tr key={e.id}>
                  <td className="mono">{e.fecha}</td>
                  <td>
                    <span className="calev" style={{ background: t[0], color: t[1], display: "inline-block" }}>
                      {eventoLabel(e)}
                    </span>
                  </td>
                  <td>{aplicaLabel(e.aplica)}</td>
                  <td style={{ textAlign: "right" }}>
                    <button type="button" className="btn ghost" onClick={() => quitar(e.id)}>
                      Quitar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="muted">Sin eventos.</p>
      )}
    </Card>
  );
}
