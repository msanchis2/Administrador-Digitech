import { Card } from "@/components/ui";
import { DIAS_SEMANA_CORTOS, TIPO_CAL } from "@/constants/calendario";
import { hoyISO, pad2 } from "@/utils/format";
import { eventoLabel } from "../eventoLabel";

const MAX_POR_DIA = 3;

/** Mes en rejilla lunes-domingo. `eventosDe(iso)` devuelve los eventos visibles de ese día. */
export default function MonthGrid({ y, m, eventosDe, onDayClick }) {
  const startW = (new Date(y, m, 1).getDay() + 6) % 7; // lunes = 0
  const dias = new Date(y, m + 1, 0).getDate();
  const hoy = hoyISO();

  return (
    <Card>
      <div className="calgrid">
        {DIAS_SEMANA_CORTOS.map((d) => (
          <div key={d} className="calhead">
            {d}
          </div>
        ))}
        {Array.from({ length: startW }, (_, i) => (
          <div key={`o${i}`} className="calcell out" />
        ))}
        {Array.from({ length: dias }, (_, i) => {
          const d = i + 1;
          const iso = `${y}-${pad2(m + 1)}-${pad2(d)}`;
          const evs = eventosDe(iso);
          const fest = evs.some((e) => e.tipo === "festivo" || e.tipo === "vacaciones");
          const cls = ["calcell", fest && "fest", iso === hoy && "today", onDayClick && "clickable"]
            .filter(Boolean)
            .join(" ");
          return (
            <div key={iso} className={cls} onClick={onDayClick ? () => onDayClick(iso) : undefined}>
              <div className="calnum">{d}</div>
              {evs.slice(0, MAX_POR_DIA).map((e) => {
                const t = TIPO_CAL[e.tipo] || TIPO_CAL.evento;
                const solo = e.aplica !== "ambos";
                return (
                  <span
                    key={e.id}
                    className="calev"
                    style={{ background: t[0], color: t[1] }}
                    title={`${eventoLabel(e)}${solo ? ` (solo ${e.aplica}º)` : ""}`}
                  >
                    {eventoLabel(e)}
                    {solo && ` ·${e.aplica}º`}
                  </span>
                );
              })}
              {evs.length > MAX_POR_DIA && <span className="calev calev-more">+{evs.length - MAX_POR_DIA}</span>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
