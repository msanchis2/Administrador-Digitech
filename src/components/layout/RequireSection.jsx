import { Navigate } from "react-router-dom";
import { canSeeSection, firstVisiblePath } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

/** Si el usuario no puede ver la sección, lo manda a la primera que sí puede. */
export default function RequireSection({ section, children }) {
  const { me } = useAuth();
  const perms = usePermissions();
  if (!canSeeSection(section, perms, me)) return <Navigate to={firstVisiblePath(perms, me)} replace />;
  return children;
}
