export const FESTIVOS_2627 = [
  "2026-10-09",
  "2026-10-12",
  "2026-11-01",
  "2026-12-06",
  "2026-12-08",
  "2026-12-24",
  "2026-12-25",
  "2026-12-31",
  "2027-01-01",
  "2027-03-17",
  "2027-03-18",
  "2027-03-19",
  "2027-03-25",
  "2027-03-26",
  "2027-03-27",
  "2027-03-28",
  "2027-03-29",
  "2027-04-05",
  "2027-05-01",
  "2027-08-15",
];

/** tipo → [fondo, texto, etiqueta] */
export const TIPO_CAL = {
  festivo: ["#FEE2E2", "#B91C1C", "Festivo"],
  vacaciones: ["#FFEDD5", "#C2410C", "Vacaciones"],
  fct: ["#EDE9FE", "#7C3AED", "FCT"],
  examen: ["#DBEAFE", "#2563EB", "Examen"],
  evento: ["#E0E7FF", "#4F46E5", "Evento"],
};

export const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const DIAS_SEMANA_CORTOS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export const FILTROS_CURSO = [
  ["ambos", "1º y 2º"],
  ["1", "Solo 1º"],
  ["2", "Solo 2º"],
];

export const aplicaLabel = (aplica) => (aplica === "ambos" ? "1º y 2º" : `Solo ${aplica}º`);
