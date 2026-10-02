/** Aviso en línea. variant: "err" | "ok" | "warn". */
export default function Message({ variant = "warn", children, style }) {
  return (
    <div className={`msg ${variant}`} style={style}>
      {children}
    </div>
  );
}
