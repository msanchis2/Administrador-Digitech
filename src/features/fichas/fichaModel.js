/** Ficha completa de un docente combinando lo guardado con lo derivado del horario. */
export function buildFicha(nombre, docentes, cargas) {
  const d = docentes[nombre] || {};
  const habilitacion = d.habilitacion?.length ? d.habilitacion : cargas[nombre]?.asignaturas.slice() || [];
  return {
    nombre,
    edad: d.edad ?? "",
    experiencia: d.experiencia ?? "",
    titulacion: d.titulacion || "",
    cargo_tipo: d.cargo_tipo || "ninguno",
    cargo_detalle: d.cargo_detalle || "",
    idoneidad: d.idoneidad || "",
    habilitacion,
    bloqueos: d.bloqueos || {},
    notas: d.notas || "",
    foto: d.foto || "",
    presentacion: d.presentacion || "",
    linkedin: d.linkedin || "",
    web: d.web || "",
  };
}

/** Porcentaje de perfil completado. */
export function completeness(f) {
  const checks = [
    !!f.foto,
    !!f.presentacion,
    !!f.titulacion,
    !!f.experiencia,
    !!f.idoneidad,
    f.habilitacion.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
