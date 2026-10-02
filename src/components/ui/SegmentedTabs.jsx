/**
 * Botonera de pestañas internas (estilo «píldora»).
 * @param {{ options: [string, string][], value: string, onChange: (k: string) => void }} props
 */
export default function SegmentedTabs({ options, value, onChange }) {
  return (
    <div className="hsub">
      {options.map(([k, l]) => (
        <button type="button" key={k} className={value === k ? "act" : ""} onClick={() => onChange(k)}>
          {l}
        </button>
      ))}
    </div>
  );
}
