import { SelectRow } from "@/components/ui";

export default function ClaseSelect({ clases, value, onChange }) {
  return (
    <SelectRow label="Clase">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {clases.map((c) => (
          <option key={c.clase} value={c.clase}>
            {c.clase}
          </option>
        ))}
      </select>
    </SelectRow>
  );
}
