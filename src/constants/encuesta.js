export const QUESTIONNAIRE = {
  docente: [
    "Claridad al explicar",
    "Materiales y recursos de la asignatura",
    "Evaluación justa y transparente",
    "Organización y ritmo de la clase",
    "Resolución de dudas y ayuda",
    "Trato y motivación en el aula",
  ],
  profesional: [
    "Puntualidad y asistencia",
    "Subida de notas y documentación en plazo",
    "Seguimiento de FCT / prácticas",
    "Coordinación con el equipo docente",
    "Comunicación y respuesta a incidencias",
    "Cumplimiento de plazos administrativos",
  ],
};

export const FAMILIA_ITEMS = [
  "Trato y motivación en el aula",
  "Resolución de dudas y ayuda",
  "Comunicación e información sobre el progreso",
];

export const COLECTIVOS = ["Alumnado", "Familia", "Coordinación", "Administración"];

export const COLECTIVO_DESC = {
  Alumnado: "Valoras la docencia de tu asignatura",
  Familia: "Trato, comunicación y seguimiento",
  Coordinación: "Todos los aspectos",
  Administración: "Puntualidad, FCT, documentación",
};

/** Preguntas que responde cada colectivo. */
export const itemsFor = (colectivo) => {
  switch (colectivo) {
    case "Alumnado":
      return QUESTIONNAIRE.docente;
    case "Administración":
      return QUESTIONNAIRE.profesional;
    case "Coordinación":
      return [...QUESTIONNAIRE.docente, ...QUESTIONNAIRE.profesional];
    case "Familia":
      return FAMILIA_ITEMS;
    default:
      return [];
  }
};

/** Ponderación por defecto de la evaluación (fracciones 0–1). */
export const DEFAULT_WEIGHTS = {
  coordDoc: 0.25,
  famGM: 0.1,
  famGS: 0.05,
  admin: 0.65,
  coordProf: 0.35,
  global: 0.6,
};

export const WEIGHT_FIELDS = [
  ["coordDoc", "Coordinación (docente)"],
  ["famGM", "Familias · medio"],
  ["famGS", "Familias · superior"],
  ["admin", "Administración (profesional)"],
  ["coordProf", "Coordinación (profesional)"],
  ["global", "Peso docente en la global"],
];
