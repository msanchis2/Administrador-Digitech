export const ESTADOS_PRACTICA = [
  "Sin empresa",
  "Empresa asignada",
  "Convenio pendiente",
  "Pendiente de inicio",
  "En curso",
  "Finalizada",
  "Cancelada",
];

/** estado → [fondo, texto] */
export const ESTADO_PRACTICA_COL = {
  "Sin empresa": ["#F1F5F9", "#475569"],
  "Empresa asignada": ["#E0E7FF", "#3730A3"],
  "Convenio pendiente": ["#FEF3C7", "#B45309"],
  "Pendiente de inicio": ["#DBEAFE", "#2563EB"],
  "En curso": ["#DCFCE7", "#15803D"],
  Finalizada: ["#E2E8F0", "#334155"],
  Cancelada: ["#FEE2E2", "#B91C1C"],
};

export const DOCS_PRACTICA = [
  ["convenio", "Convenio"],
  ["anexo_inicial", "Anexo inicial"],
  ["anexo_final", "Anexo final"],
  ["otros", "Otros"],
];

export const DOC_ESTADOS_PRACTICA = [
  "No generado",
  "Generado pdte. firma",
  "Enviado",
  "Firmado pdte. subir",
  "Completo",
  "Incidencia",
];

export const HORAS_PRESET = [100, 400, 500];
