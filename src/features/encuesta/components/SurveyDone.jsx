import { Card } from "@/components/ui";

export default function SurveyDone({ onAgain }) {
  return (
    <div className="enc">
      <Card className="enc-done">
        <div className="enc-check">✓</div>
        <h2>¡Gracias!</h2>
        <p className="muted">Tu valoración se ha registrado de forma anónima.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
          <button type="button" className="btn primary" onClick={onAgain}>
            Responder otra
          </button>
        </div>
      </Card>
    </div>
  );
}
