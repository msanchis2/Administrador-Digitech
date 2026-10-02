export default function Card({ title, children, className = "", style }) {
  return (
    <div className={`card ${className}`.trim()} style={style}>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}
