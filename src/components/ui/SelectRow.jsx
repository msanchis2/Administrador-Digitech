/** Fila «etiqueta + selector» usada en las cabeceras de muchas vistas. */
export default function SelectRow({ label, children, style }) {
  return (
    <div className="hselrow" style={style}>
      {label && <label className="muted">{label}</label>}
      {children}
    </div>
  );
}
