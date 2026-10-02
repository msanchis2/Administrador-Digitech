/** Fila de contadores grandes. items = [[etiqueta, valor], …] */
export default function StatsRow({ items }) {
  return (
    <div className="prstats">
      {items.map(([label, value]) => (
        <div key={label}>
          <b>{value}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
