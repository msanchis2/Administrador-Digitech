import { SelectRow } from "@/components/ui";
import { completeness } from "../fichaModel";

export default function ProfesorChips({ nombres, selected, onSelect, getFicha, miNombre }) {
  return (
    <SelectRow style={{ flexWrap: "wrap" }}>
      {nombres.map((x) => {
        const c = completeness(getFicha(x));
        return (
          <button
            type="button"
            key={x}
            className={`chip ${x === selected ? "sel" : ""}`}
            onClick={() => onSelect(x)}
            title={`Perfil completo al ${c}%`}
          >
            <span className="compdot" style={{ background: `conic-gradient(var(--accent) ${c * 3.6}deg,#E2E8F0 0)` }} />
            {x}
            {miNombre === x && <span className="younote">tú</span>}
          </button>
        );
      })}
    </SelectRow>
  );
}
