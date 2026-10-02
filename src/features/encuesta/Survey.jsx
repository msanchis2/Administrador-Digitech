import { useMemo, useReducer, useState } from "react";
import { Card } from "@/components/ui";
import { FAMILIA_ITEMS, itemsFor, QUESTIONNAIRE } from "@/constants/encuesta";
import { useToast } from "@/context/ToastContext";
import { SCHEDULE } from "@/data/schedule";
import { insertRespuesta } from "@/services/encuesta";
import { to100 } from "@/utils/evaluacion";
import { deriveUnits, profesoresDe } from "@/utils/schedule";
import StepColectivo from "./components/StepColectivo";
import StepProfesor from "./components/StepProfesor";
import StepValoracion from "./components/StepValoracion";
import SurveyDone from "./components/SurveyDone";
import { initialSurvey, surveyReducer } from "./surveyReducer";
import "./encuesta.css";

const STEPS = ["1 · Quién eres", "2 · Profesor/a", "3 · Valoración"];

/** Fila anónima para la tabla `respuestas` (notas 0–100 por bloque). */
function buildRespuesta({ colectivo, profesor, unit, ratings }) {
  const esAlumno = colectivo === "Alumnado";
  return {
    colectivo,
    profesor,
    asignatura: esAlumno ? unit?.asig : null,
    grado: esAlumno ? unit?.grado : null,
    docente: esAlumno || colectivo === "Coordinación" ? to100(ratings, QUESTIONNAIRE.docente) : null,
    profesional:
      colectivo === "Administración" || colectivo === "Coordinación" ? to100(ratings, QUESTIONNAIRE.profesional) : null,
    familia: colectivo === "Familia" ? to100(ratings, FAMILIA_ITEMS) : null,
  };
}

/** Encuesta de valoración del profesorado en 3 pasos. */
export default function Survey() {
  const toast = useToast();
  const [state, dispatch] = useReducer(surveyReducer, initialSurvey);
  const [sending, setSending] = useState(false);

  const teachers = useMemo(() => profesoresDe(SCHEDULE.clases), []);
  const allUnits = useMemo(() => deriveUnits(SCHEDULE.clases), []);
  const units = state.profesor ? allUnits[state.profesor] || [] : [];
  const items = itemsFor(state.colectivo);

  const onSend = async () => {
    setSending(true);
    try {
      await insertRespuesta(buildRespuesta(state));
      dispatch({ type: "done" });
    } catch (e) {
      toast(`No se pudo enviar: ${e.message}`);
    } finally {
      setSending(false);
    }
  };

  if (state.done) return <SurveyDone onAgain={() => dispatch({ type: "reset" })} />;

  return (
    <div className="enc">
      <div className="enc-steps">
        {STEPS.map((s, i) => (
          <span key={s} className={state.step >= i + 1 ? "on" : ""}>
            {s}
          </span>
        ))}
      </div>
      <Card>
        {state.step === 1 && (
          <StepColectivo
            value={state.colectivo}
            onSelect={(c) => dispatch({ type: "colectivo", value: c })}
            onNext={() => dispatch({ type: "step", value: 2 })}
          />
        )}
        {state.step === 2 && <StepProfesor state={state} teachers={teachers} units={units} dispatch={dispatch} />}
        {state.step === 3 && (
          <StepValoracion state={state} items={items} dispatch={dispatch} onSend={onSend} sending={sending} />
        )}
      </Card>
      <p className="muted" style={{ textAlign: "center", marginTop: 12 }}>
        Respuestas anónimas: no se guarda ningún dato que te identifique.
      </p>
    </div>
  );
}
