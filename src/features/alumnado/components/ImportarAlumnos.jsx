import { useState } from "react";
import { Card, FileButton } from "@/components/ui";
import { insertAlumnos } from "@/services/alumnos";
import { readSheet, rowToAlumno } from "@/utils/excel";

export default function ImportarAlumnos({ grupo, onImported }) {
  const [msg, setMsg] = useState("");

  const importar = async (file) => {
    setMsg("Leyendo…");
    try {
      const json = await readSheet(file);
      if (!json.length) return setMsg("El archivo está vacío o no tiene encabezados.");
      const rows = json.map((o) => rowToAlumno(o, grupo)).filter(Boolean);
      if (!rows.length) return setMsg("No encontré nombres. Revisa que haya columnas Apellidos/Nombre.");
      await insertAlumnos(rows);
      setMsg(`Importados ${rows.length} alumnos.`);
      onImported();
    } catch (e) {
      setMsg(`Error al importar: ${e.message}`);
    }
  };

  return (
    <Card title={`Importar alumnos desde Excel · ${grupo}`}>
      <p className="muted">
        Sube un Excel con una fila por alumno. Reconoce <b>Apellidos</b>, <b>Nombre</b> y, si están, <b>NIA</b>,{" "}
        <b>DNI</b>, <b>Email</b>, <b>Teléfono</b> y <b>Dirección</b>.
      </p>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <FileButton accept=".xlsx,.xls,.csv" onFile={importar}>
          Elegir Excel
        </FileButton>
        <span className="muted">{msg}</span>
      </div>
    </Card>
  );
}
