/** Casilla con una sesión (asignatura + segunda línea coloreada). */
export default function SessionCell({ ciclo, title, subtitle, subtitleColor, dim, picked, onClick }) {
  const cls = ["hsess", onClick && "click", dim && "dim", picked && "picked"].filter(Boolean).join(" ");
  const style = { background: ciclo.s, borderColor: ciclo.c };
  const content = (
    <>
      <span className="a">{title}</span>
      <span className="p" style={{ color: subtitleColor, fontWeight: 600 }}>
        {subtitle}
      </span>
    </>
  );
  return onClick ? (
    <button type="button" className={cls} style={style} onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className={cls} style={style}>
      {content}
    </div>
  );
}
