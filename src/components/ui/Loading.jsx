import Card from "./Card";

export default function Loading({ text = "Cargando…" }) {
  return (
    <Card>
      <p className="muted">{text}</p>
    </Card>
  );
}
