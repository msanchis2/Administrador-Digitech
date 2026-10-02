import { useState } from "react";
import { Card } from "@/components/ui";
import { desactivarAlumno } from "@/services/alumnos";
import { nombreCompleto } from "@/utils/format";
import EditarAlumno from "./EditarAlumno";
import ImportarAlumnos from "./ImportarAlumnos";

export default function GestionAlumnos({ grupo, roster, reload }) {
  const [editId, setEditId] = useState(null);
  const editando = editId ? roster.find((a) => a.id === editId) : null;

  const quitar = async (id) => {
    if (!window.confirm("¿Quitar a este alumno del grupo?")) return;
    try {
      await desactivarAlumno(id);
      setEditId(null);
      reload();
    } catch (e) {
      window.alert(`No se pudo: ${e.message}`);
    }
  };

  return (
    <>
      <ImportarAlumnos grupo={grupo} onImported={reload} />
      {editando && (
        <EditarAlumno
          key={editando.id}
          alumno={editando}
          onClose={() => setEditId(null)}
          onSaved={() => {
            setEditId(null);
            reload();
          }}
        />
      )}
      <Card title={`Alumnos en ${grupo} (${roster.length})`}>
        {roster.length ? (
          <table>
            <thead>
              <tr>
                <th>Apellidos, Nombre</th>
                <th>NIA</th>
                <th>DNI</th>
                <th>Matrícula</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {roster.map((a) => (
                <tr key={a.id}>
                  <td>{nombreCompleto(a)}</td>
                  <td className="mono">{a.nia || ""}</td>
                  <td className="mono">{a.dni || ""}</td>
                  <td>{a.documentos?.matricula || "—"}</td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button type="button" className="btn ghost" onClick={() => setEditId(a.id)}>
                      Editar
                    </button>{" "}
                    <button type="button" className="btn ghost" onClick={() => quitar(a.id)}>
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">Sin alumnos todavía. Importa un Excel arriba.</p>
        )}
      </Card>
    </>
  );
}
