import { CICLOS } from "@/constants/ciclos";

/** Leyenda de colores. Por defecto, la de ciclos; acepta `items` = [{key, color, label}]. */
export default function CicloLegend({ items }) {
  const list = items || CICLOS.map((x) => ({ key: x.k, color: x.c, label: x.k }));
  return (
    <div className="legend">
      {list.map((x) => (
        <span key={x.key}>
          <span className="dot" style={{ background: x.color }} />
          {x.label}
        </span>
      ))}
    </div>
  );
}
