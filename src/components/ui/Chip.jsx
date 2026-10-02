export default function Chip({ selected, children, onClick, title }) {
  return (
    <button type="button" className={`chip ${selected ? "sel" : ""}`} onClick={onClick} title={title}>
      {children}
    </button>
  );
}
