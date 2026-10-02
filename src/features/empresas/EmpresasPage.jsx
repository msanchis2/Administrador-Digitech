import { useState } from "react";
import { Card, FileButton, Loading } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import { deleteEmpresa, fetchEmpresas, insertEmpresas, upsertEmpresa } from "@/services/empresas";
import { readSheet, rowToEmpresa } from "@/utils/excel";
import EmpresaForm from "./components/EmpresaForm";

const porNombre = (a, b) => (a.nombre || "").localeCompare(b.nombre || "");

export default function EmpresasPage() {
  const toast = useToast();
  const { data: list, setData: setList, loading } = useAsyncData(() => fetchEmpresas().catch(() => []), [], []);
  const [q, setQ] = useState("");
  // null = cerrado · {} = nueva · objeto = editando
  const [editando, setEditando] = useState(null);

  if (loading) return <Loading text="Cargando empresas…" />;

  const needle = q.toLowerCase();
  const filtradas = list.filter(
    (e) =>
      !needle || (e.nombre || "").toLowerCase().includes(needle) || (e.localidad || "").toLowerCase().includes(needle),
  );

  const onSave = async (f) => {
    if (!f.nombre?.trim()) return toast("La empresa necesita al menos un nombre");
    const row = { ...f, max_alumnos: f.max_alumnos ? parseInt(f.max_alumnos, 10) : null, ciclos: f.ciclos || [] };
    try {
      const data = await upsertEmpresa(row);
      setList((l) => [...l.filter((x) => x.id !== data.id), data].sort(porNombre));
      setEditando(data);
      toast("Empresa guardada");
    } catch (e) {
      toast(`No se pudo guardar: ${e.message}`);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta empresa?")) return;
    try {
      await deleteEmpresa(id);
      setList((l) => l.filter((x) => x.id !== id));
      setEditando(null);
      toast("Empresa eliminada");
    } catch (e) {
      toast(`No se pudo: ${e.message}`);
    }
  };

  const onImport = async (file) => {
    try {
      const rows = (await readSheet(file)).map(rowToEmpresa).filter(Boolean);
      if (!rows.length) return toast("No encontré empresas (revisa que haya columna Nombre)");
      const data = await insertEmpresas(rows);
      setList((l) => [...l, ...data].sort(porNombre));
      toast(`Importadas ${rows.length} empresas`);
    } catch (e) {
      toast(`Error al importar: ${e.message}`);
    }
  };

  return (
    <>
      <div className="hbar">
        <div className="hselrow" style={{ margin: 0 }}>
          <input
            placeholder="Buscar empresa…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 220 }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <FileButton accept=".xlsx,.xls,.csv" onFile={onImport}>
            Importar Excel
          </FileButton>
          <button type="button" className="btn primary" onClick={() => setEditando({})}>
            ＋ Nueva empresa
          </button>
        </div>
      </div>

      <Card style={{ padding: "6px 0" }}>
        <table>
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Localidad</th>
              <th>Ciclos</th>
              <th>Contacto</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length ? (
              filtradas.map((e) => (
                <tr key={e.id} className="rowlink" onClick={() => setEditando(e)}>
                  <td style={{ fontWeight: 600 }}>{e.nombre || ""}</td>
                  <td>{e.localidad || ""}</td>
                  <td>
                    {(e.ciclos || []).map((c) => (
                      <span key={c} className="cytag cytag-light">
                        {c}
                      </span>
                    ))}
                  </td>
                  <td>{e.contacto_nombre || ""}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="muted" style={{ padding: 14 }}>
                  Sin empresas. Crea una o importa un Excel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {editando && (
        <EmpresaForm
          key={editando.id || "new"}
          empresa={editando}
          onSave={onSave}
          onDelete={onDelete}
          onClose={() => setEditando(null)}
        />
      )}
    </>
  );
}
