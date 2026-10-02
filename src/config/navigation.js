/**
 * Mapa de secciones de la app. Cada hoja tiene una ruta y una regla de
 * visibilidad basada en los permisos (`usePermissions`) y el perfil (`me`).
 */
export const SECTIONS = {
  horarios: { path: "/horarios", label: "Horarios", canSee: () => true },
  fichas: { path: "/profesorado", label: "Profesorado", canSee: () => true },
  evaluacion: { path: "/evaluacion", label: "Evaluación", canSee: (p) => p.gestion },
  alumnado: { path: "/alumnado", label: "Alumnado", canSee: () => true },
  ausencias: { path: "/ausencias", label: "Ausencias", canSee: () => true },
  calendario: { path: "/calendario", label: "Calendario", canSee: () => true },
  practicas: { path: "/practicas", label: "Prácticas", canSee: (p, me) => p.adminOAdm || !!me.docente },
  empresas: { path: "/empresas", label: "Empresas", canSee: (p) => p.adminOAdm },
  informes: { path: "/informes", label: "Informes", canSee: (p) => p.adminOAdm },
  encuesta: { path: "/encuesta", label: "Encuesta", canSee: () => true },
  usuarios: { path: "/usuarios", label: "Usuarios", canSee: (p) => p.isAdmin },
};

/** Navegación principal: entradas sueltas o grupos con subnavegación. */
export const NAV_GROUPS = [
  { key: "horarios" },
  { label: "Docencia", children: ["fichas", "evaluacion"] },
  { label: "Alumnos", children: ["alumnado", "ausencias"] },
  { key: "calendario" },
  { label: "Prácticas", children: ["practicas", "empresas", "informes"] },
  { key: "encuesta" },
  { key: "usuarios" },
];

/** Ruta pública (sin login) de la encuesta. */
export const PUBLIC_SURVEY_PATH = "/publica/encuesta";

export const canSeeSection = (key, perms, me) => SECTIONS[key].canSee(perms, me);

/** Grupos visibles para el usuario (los grupos sin hijos visibles desaparecen). */
export function visibleNav(perms, me) {
  return NAV_GROUPS.map((g) => {
    if (g.children) {
      const children = g.children.filter((k) => canSeeSection(k, perms, me));
      return children.length ? { ...g, children } : null;
    }
    return canSeeSection(g.key, perms, me) ? g : null;
  }).filter(Boolean);
}

/** Primera sección visible: destino por defecto tras el login. */
export const firstVisiblePath = (perms, me) => {
  const g = visibleNav(perms, me)[0];
  return SECTIONS[g.children ? g.children[0] : g.key].path;
};
