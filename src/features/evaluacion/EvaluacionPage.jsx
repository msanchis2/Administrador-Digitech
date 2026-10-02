import { useMemo, useState } from "react";
import { Loading, SelectRow } from "@/components/ui";
import { usePermissions } from "@/hooks/usePermissions";
import { computeVal } from "@/utils/evaluacion";
import { r0 } from "@/utils/format";
import PesosPanel from "./components/PesosPanel";
import ResultadoBox from "./components/ResultadoBox";
import { useEvaluacion } from "./useEvaluacion";
import "./evaluacion.css";

export default function EvaluacionPage() {
  const { isAdmin } = usePermissions();
  const { loading, units, nombres, respuestas, weights, setWeights } = useEvaluacion();
  const [sel, setSel] = useState(null);

  // Una sola pasada por profesor (antes se recalculaba en cada chip y otra vez para el seleccionado).
  const valores = useMemo(() => {
    const ctx = { units, respuestas, weights };
    return Object.fromEntries(nombres.map((n) => [n, computeVal(ctx, n)]));
  }, [units, respuestas, weights, nombres]);

  if (loading) return <Loading text="Cargando evaluación…" />;

  const actual = sel && units[sel] ? sel : nombres[0];

  return (
    <>
      <PesosPanel weights={weights} onChange={setWeights} editable={isAdmin} />
      <SelectRow style={{ flexWrap: "wrap" }}>
        {nombres.map((nm) => (
          <button type="button" key={nm} className={`chip ${nm === actual ? "sel" : ""}`} onClick={() => setSel(nm)}>
            {nm}
            {valores[nm].global != null && <span className="chipnota">{r0(valores[nm].global)}</span>}
          </button>
        ))}
      </SelectRow>
      {actual && <ResultadoBox nombre={actual} v={valores[actual]} />}
    </>
  );
}
