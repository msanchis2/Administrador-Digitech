/** Ciclos formativos con su color principal (c) y su fondo suave (s). */
export const CICLOS = [
  { k: "SMR", c: "#2563EB", s: "#DBEAFE" },
  { k: "DAM", c: "#16A34A", s: "#DCFCE7" },
  { k: "ASIR", c: "#0D9488", s: "#CCFBF1" },
  { k: "DAW", c: "#7C3AED", s: "#EDE9FE" },
  { k: "Marketing", c: "#EA580C", s: "#FFEDD5" },
];

export const CICLO_DESCONOCIDO = { k: "?", c: "#64748B", s: "#E2E8F0" };

/** Ciclos de grado medio; el resto son de grado superior. */
export const CICLOS_GRADO_MEDIO = new Set(["SMR", "Marketing"]);

export const CICLOS_KEYS = CICLOS.map((x) => x.k);

/** Color identificativo de cada profesor/a en las rejillas de horario. */
export const PROF_COL = {
  Adriana: "#E6194B",
  Álvaro: "#16A085",
  Belda: "#E67E22",
  Belén: "#B7950B",
  Carmen: "#27AE60",
  "David Juan": "#2980B9",
  Iván: "#8E44AD",
  Jaime: "#C0392B",
  Lydia: "#D81B94",
  Marti: "#2C3E50",
  Noelia: "#7F8C00",
  Raúl: "#6C3483",
  Reme: "#566573",
  Roberto: "#A04000",
  Tono: "#1F618D",
  Óscar: "#7B241C",
};
export const PROF_COL_DEFAULT = "#64748B";
