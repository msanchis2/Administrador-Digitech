export const numOrNull = (v) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
};

/** Redondea una nota; «—» si no hay dato. */
export const r0 = (x) => (x == null ? "—" : Math.round(x));

export const pad2 = (n) => String(n).padStart(2, "0");

/** Fecha de hoy en formato YYYY-MM-DD (hora local). */
export const hoyISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

export const nowISO = () => new Date().toISOString();

export const clone = (x) => structuredClone(x);

export const byLocale = (a, b) => a.localeCompare(b);

/** «Apellidos, Nombre» tolerando que falte alguno de los dos. */
export const nombreCompleto = (a) =>
  a ? `${a.apellidos || ""}${a.apellidos && a.nombre ? ", " : ""}${a.nombre || ""}` : "—";

/** Rango de fechas «inicio → fin». */
export const rangoFechas = (ini, fin, vacio = "—") => `${ini || vacio}${fin ? ` → ${fin}` : ""}`;

/** Solo deja pasar enlaces http(s); evita `javascript:` en URLs escritas por usuarios. */
export const safeUrl = (url) => {
  const u = (url || "").trim();
  if (!u) return "";
  const withProto = /^[a-z][a-z0-9+.-]*:/i.test(u) ? u : `https://${u}`;
  return /^https?:\/\//i.test(withProto) ? withProto : "";
};
