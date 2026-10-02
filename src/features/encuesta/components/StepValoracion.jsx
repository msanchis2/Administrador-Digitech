import StarRating from "./StarRating";

export default function StepValoracion({ state, items, dispatch, onSend, sending }) {
  const { profesor, unit, ratings } = state;
  const allRated = items.length > 0 && items.every((i) => ratings[i]);
  return (
    <>
      <h2>Valora del 1 al 5</h2>
      <p className="muted">
        {profesor}
        {unit && ` · ${unit.asig} (${unit.grado})`}
      </p>
      <div className="enc-items">
        {items.map((it) => (
          <div key={it} className="enc-item">
            <span>{it}</span>
            <StarRating
              label={it}
              value={ratings[it] || 0}
              onChange={(v) => dispatch({ type: "rate", item: it, value: v })}
            />
          </div>
        ))}
      </div>
      <div className="enc-nav">
        <button type="button" className="btn ghost" onClick={() => dispatch({ type: "step", value: 2 })}>
          Atrás
        </button>
        <button type="button" className="btn primary" disabled={!allRated || sending} onClick={onSend}>
          {sending ? "Enviando…" : "Enviar valoración"}
        </button>
      </div>
    </>
  );
}
