export const ROLES = [
  ["admin", "Administrador"],
  ["coordinacion", "Coordinación"],
  ["administracion", "Administración"],
  ["profesor", "Profesor/a"],
];

export const roleLabel = (r) => (ROLES.find((x) => x[0] === r) || [r, r])[1];

export const CARGOS = [
  ["ninguno", "Sin cargo"],
  ["tutoria", "Tutoría"],
  ["coordinacion", "Coordinación"],
  ["jefatura", "Jefatura de dpto."],
];

export const IDONEIDADES = ["Medio", "Superior", "Ambos"];
