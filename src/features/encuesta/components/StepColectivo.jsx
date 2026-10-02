import { COLECTIVOS, COLECTIVO_DESC } from "@/constants/encuesta";

export default function StepColectivo({ value, onSelect, onNext }) {
  return (
    <>
      <h2>¿Desde qué colectivo respondes?</h2>
      <div className="enc-roles">
        {COLECTIVOS.map((c) => (
          <button type="button" key={c} className={`enc-role ${value === c ? "sel" : ""}`} onClick={() => onSelect(c)}>
            <b>{c}</b>
            <span>{COLECTIVO_DESC[c]}</span>
          </button>
        ))}
      </div>
      <div className="enc-nav">
        <span />
        <button type="button" className="btn primary" disabled={!value} onClick={onNext}>
          Siguiente
        </button>
      </div>
    </>
  );
}
