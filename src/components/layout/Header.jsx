import { roleLabel } from "@/constants/roles";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Brand from "./Brand";

export default function Header() {
  const { me, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  return (
    <header>
      <Brand subtitle="Panel del centro" />
      <div className="userbox">
        <span>{me.nombre}</span>
        <span className="rolepill">{roleLabel(me.rol)}</span>
        <button type="button" className="btn ghost" onClick={toggleTheme} title="Cambiar tema">
          {isDark ? "☀️" : "🌙"}
        </button>
        <button type="button" className="btn ghost" onClick={logout}>
          Salir
        </button>
      </div>
    </header>
  );
}
