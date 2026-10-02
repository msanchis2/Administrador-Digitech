export default function StarRating({ value = 0, onChange, label }) {
  return (
    <span className="stars" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          type="button"
          key={i}
          className={`star ${value >= i ? "on" : ""}`}
          onClick={() => onChange(i)}
          aria-label={`${i} de 5`}
          aria-checked={value === i}
          role="radio"
        >
          ★
        </button>
      ))}
    </span>
  );
}
