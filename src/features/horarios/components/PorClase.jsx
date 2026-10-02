import ClaseGrid from "./ClaseGrid";
import ClaseSelect from "./ClaseSelect";
import FctImpact from "./FctImpact";

export default function PorClase({ clases, fct, clase, onClase }) {
  return (
    <>
      <FctImpact clases={clases} fct={fct} />
      <ClaseSelect clases={clases} value={clase.clase} onChange={onClase} />
      <ClaseGrid clases={clases} cl={clase} fct={fct} />
    </>
  );
}
