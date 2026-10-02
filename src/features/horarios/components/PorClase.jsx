import ClaseEditor from "./ClaseEditor";
import ClaseGrid from "./ClaseGrid";
import ClaseSelect from "./ClaseSelect";
import FctImpact from "./FctImpact";

export default function PorClase({ clases, bloqueos, fct, clase, onClase, editing }) {
  return (
    <>
      <FctImpact clases={clases} fct={fct} />
      <ClaseSelect clases={clases} value={clase.clase} onChange={onClase} />
      {editing ? (
        <ClaseEditor key={clase.clase} clases={clases} bloqueos={bloqueos} fct={fct} clase={clase} />
      ) : (
        <ClaseGrid clases={clases} bloqueos={bloqueos} cl={clase} fct={fct} />
      )}
    </>
  );
}
