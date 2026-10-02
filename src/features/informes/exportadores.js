import { nombreCompleto } from "@/utils/format";

/** Mapeos de cada tabla a las columnas del Excel exportado. */
export const alumnosRows = (alumnos) =>
  alumnos.map((a) => ({
    Grupo: a.grupo,
    Apellidos: a.apellidos,
    Nombre: a.nombre,
    NIA: a.nia,
    DNI: a.dni,
    Email: a.email,
    Teléfono: a.telefono,
    Matrícula: a.documentos?.matricula || "",
    Expediente: a.documentos?.expediente || "",
  }));

export const empresasRows = (empresas) =>
  empresas.map((e) => ({
    Nombre: e.nombre,
    CIF: e.cif,
    Localidad: e.localidad,
    Provincia: e.provincia,
    Teléfono: e.telefono,
    Email: e.email,
    Contacto: e.contacto_nombre,
    Ciclos: (e.ciclos || []).join(" "),
  }));

export function practicasRows(practicas, alumnos, empresas) {
  const alById = new Map(alumnos.map((a) => [a.id, a]));
  const empById = new Map(empresas.map((e) => [e.id, e]));
  return practicas.map((p) => {
    const a = alById.get(p.alumno_id);
    const e = empById.get(p.empresa_id);
    return {
      Alumno: a ? nombreCompleto(a) : "",
      Grupo: a ? a.grupo : "",
      Empresa: e ? e.nombre : "",
      Estado: p.estado,
      Inicio: p.fecha_inicio,
      Fin: p.fecha_fin,
      Horas: p.horas,
      "Tutor centro": p.tutor_centro,
      "Tutor empresa": p.tutor_empresa,
    };
  });
}
