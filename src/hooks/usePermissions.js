import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

/** Permisos derivados del rol y de los flags del perfil. */
export function permissionsFor(me) {
  if (!me) return null;
  const rol = me.rol;
  const isAdmin = rol === "admin";
  const gestion = ["admin", "coordinacion", "administracion"].includes(rol);
  const adminOAdm = ["admin", "administracion"].includes(rol);
  return {
    isAdmin,
    /** admin, coordinación o administración */
    gestion,
    /** admin o administración */
    adminOAdm,
    canEditHorarios: isAdmin || me.edita_horarios,
    canEditFichas: isAdmin || me.edita_fichas,
    gestionaAlumnos: adminOAdm,
    gestionaPracticas: adminOAdm,
    gestionaCalendario: gestion,
    veTodasLasAusencias: gestion,
    veTodosLosGrupos: gestion,
  };
}

export function usePermissions() {
  const { me } = useAuth();
  return useMemo(() => permissionsFor(me), [me]);
}
