/** Etiqueta + control de formulario. */
export default function Field({ label, children, style, className = "" }) {
  return (
    <div className={`field ${className}`.trim()} style={style}>
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}
