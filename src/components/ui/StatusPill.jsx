/** Píldora de color. `colors` = [fondo, texto]. */
export default function StatusPill({ colors = ["#E2E8F0", "#334155"], children }) {
  return (
    <span className="pill" style={{ background: colors[0], color: colors[1] }}>
      {children}
    </span>
  );
}
