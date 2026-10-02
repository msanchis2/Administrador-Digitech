import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SECTIONS, visibleNav } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

/** Navegación principal + subnavegación del grupo activo. */
export default function MainNav() {
  const { me } = useAuth();
  const perms = usePermissions();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const groups = visibleNav(perms, me);
  const isActive = (key) => pathname.startsWith(SECTIONS[key].path);
  const activeGroup = groups.find((g) => g.children?.some(isActive));

  return (
    <>
      <nav className="nav">
        {groups.map((g) =>
          g.children ? (
            <button
              type="button"
              key={g.label}
              className={g === activeGroup ? "act" : ""}
              onClick={() => navigate(SECTIONS[g.children[0]].path)}
            >
              {g.label}
            </button>
          ) : (
            <NavLink key={g.key} to={SECTIONS[g.key].path} className={({ isActive: a }) => (a ? "act" : "")}>
              {SECTIONS[g.key].label}
            </NavLink>
          ),
        )}
      </nav>
      {activeGroup && (
        <div className="subnav">
          {activeGroup.children.map((k) => (
            <NavLink key={k} to={SECTIONS[k].path} className={({ isActive: a }) => (a ? "act" : "")}>
              {SECTIONS[k].label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}
