export const ESTADOS_ASISTENCIA = [
  ["presente", "P"],
  ["ausente", "A"],
  ["retraso", "R"],
  ["justificada", "J"],
];

/** [fondo, texto] para cada estado de asistencia. */
export const ESTADO_ASISTENCIA_COL = {
  presente: ["#DCFCE7", "#15803D"],
  ausente: ["#FEE2E2", "#B91C1C"],
  retraso: ["#FEF3C7", "#B45309"],
  justificada: ["#E0E7FF", "#3730A3"],
};

export const DOCS_ALUMNO = [
  ["matricula", "Matrícula"],
  ["expediente", "Expediente académico"],
];

export const ESTADOS_DOC_ALUMNO = ["Pendiente", "Entregada", "Completa", "Incidencia"];

/** Campos editables de la ficha de alumno: [clave, etiqueta, tipo, ancho]. */
export const CAMPOS_ALUMNO = [
  ["apellidos", "Apellidos"],
  ["nombre", "Nombre"],
  ["nia", "NIA"],
  ["dni", "DNI/NIE"],
  ["fecha_nac", "Fecha nacimiento", "date"],
  ["telefono", "Teléfono"],
  ["email", "Email"],
  ["direccion", "Dirección", "text", 2],
];
