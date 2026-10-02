import { useMemo } from "react";
import { Card } from "@/components/ui";
import { ROLES } from "@/constants/roles";
import { useToast } from "@/context/ToastContext";
import { SCHEDULE } from "@/data/schedule";
import { updateProfile } from "@/services/usuarios";
import { profesoresDe } from "@/utils/schedule";

const compact = { width: "auto", padding: "6px 8px" };

export default function UsuariosTable({ users, meId, onPatch }) {
  const toast = useToast();
  const teachers = useMemo(() => profesoresDe(SCHEDULE.clases), []);

  /** Aplica en local, guarda y deshace si falla. */
  const patch = async (u, changes, okMsg, errPrefix) => {
    const before = Object.fromEntries(Object.keys(changes).map((k) => [k, u[k]]));
    onPatch(u.id, changes);
    try {
      await updateProfile(u.id, changes);
      if (okMsg) toast(okMsg);
    } catch (e) {
      onPatch(u.id, before);
      window.alert(`${errPrefix}: ${e.message}`);
    }
  };

  return (
    <Card title={`Usuarios del centro (${users.length})`}>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Profesor</th>
            <th>Horarios</th>
            <th>Fichas</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td className="mono">{u.email}</td>
              <td>
                <select
                  style={compact}
                  value={u.rol}
                  disabled={u.id === meId}
                  onChange={(e) => patch(u, { rol: e.target.value }, null, "No se pudo cambiar el rol")}
                >
                  {ROLES.map(([k, l]) => (
                    <option key={k} value={k}>
                      {l}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  style={compact}
                  value={u.docente_nombre || ""}
                  onChange={(e) =>
                    patch(u, { docente_nombre: e.target.value || null }, "Profesor asignado", "No se pudo asignar")
                  }
                >
                  <option value="">—</option>
                  {teachers.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </td>
              {["edita_horarios", "edita_fichas"].map((k) => (
                <td key={k} style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    style={{ width: "auto" }}
                    checked={!!u[k]}
                    disabled={u.rol === "admin"}
                    onChange={(e) =>
                      patch(u, { [k]: e.target.checked }, "Permiso actualizado", "No se pudo cambiar el permiso")
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted" style={{ marginTop: 10 }}>
        «Profesor» enlaza cada cuenta con su ficha, para que esa persona pueda editar su propio perfil (foto,
        presentación, enlaces…).
      </p>
    </Card>
  );
}
