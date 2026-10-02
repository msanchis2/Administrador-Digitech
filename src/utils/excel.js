/**
 * Utilidades de Excel. `xlsx` se carga bajo demanda (import dinámico) para no
 * engordar el bundle inicial: solo se descarga al importar/exportar.
 */
const loadXLSX = () => import("xlsx");

/** Lee la primera hoja de un fichero y devuelve una fila-objeto por línea. */
export async function readSheet(file) {
  const XLSX = await loadXLSX();
  const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
  return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
}

/** Descarga `rows` como `<nombre>.xlsx`. */
export async function exportXLSX(rows, nombre) {
  const XLSX = await loadXLSX();
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Datos");
  XLSX.writeFile(wb, `${nombre}.xlsx`);
}

/** Devuelve el primer valor no vacío de `obj` cuya cabecera coincida con algún candidato. */
export function pick(obj, cands) {
  const keys = Object.keys(obj);
  for (const cand of cands) {
    const k = keys.find((key) => key.toLowerCase().trim() === cand);
    if (k && obj[k] != null && String(obj[k]).trim() !== "") return String(obj[k]).trim();
  }
  return null;
}

/** Fila de Excel → alumno (o null si no hay nombre). */
export function rowToAlumno(o, grupo) {
  let apellidos = pick(o, ["apellidos", "apellido"]);
  let nombre = pick(o, ["nombre", "nombres"]);
  const full = pick(o, ["apellidos y nombre", "alumno", "alumno/a", "nombre completo"]);
  if (!apellidos && !nombre && full) {
    const p = full.split(",");
    if (p.length > 1) {
      apellidos = p[0].trim();
      nombre = p.slice(1).join(",").trim();
    } else nombre = full;
  }
  if (!apellidos && !nombre) return null;
  return {
    grupo,
    apellidos: apellidos || null,
    nombre: nombre || null,
    nia: pick(o, ["nia"]),
    email: pick(o, ["email", "correo", "e-mail"]),
    telefono: pick(o, ["teléfono", "telefono", "tel", "móvil", "movil"]),
    dni: pick(o, ["dni", "dni/nie", "nie", "dni / nie", "documento"]),
    direccion: pick(o, ["dirección", "direccion", "domicilio"]),
    activo: true,
  };
}

/** Fila de Excel → empresa (o null si no hay nombre). */
export function rowToEmpresa(o) {
  const nombre = pick(o, ["nombre", "empresa", "razón social", "razon social"]);
  if (!nombre) return null;
  return {
    nombre,
    cif: pick(o, ["cif", "nif"]),
    direccion: pick(o, ["dirección", "direccion"]),
    localidad: pick(o, ["localidad", "población", "poblacion", "ciudad"]),
    provincia: pick(o, ["provincia"]),
    cp: pick(o, ["cp", "código postal", "codigo postal", "c.p."]),
    telefono: pick(o, ["teléfono", "telefono", "tel"]),
    email: pick(o, ["email", "correo", "e-mail"]),
    contacto_nombre: pick(o, ["persona de contacto", "contacto"]),
    contacto_email: pick(o, ["email contacto", "correo contacto"]),
    contacto_tel: pick(o, ["teléfono contacto", "telefono contacto"]),
  };
}
