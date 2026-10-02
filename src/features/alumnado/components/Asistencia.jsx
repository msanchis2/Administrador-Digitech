import { useState } from "react";
import { Card, SaveBar, SelectRow } from "@/components/ui";
import { ESTADOS_ASISTENCIA, ESTADO_ASISTENCIA_COL } from "@/constants/alumnado";
import { upsertAsistencia } from "@/services/alumnos";
import { nombreCompleto, nowISO } from "@/utils/format";

const DEFAULT = { estado: "presente", nota: "" };

/** Pase de lista de un día. Se monta con `key` por grupo+fecha para reiniciar el estado. */
export default function Asistencia({ me, grupo, fecha, onFecha, roster, initialAsis, puedeImportar }) {
  const [asis, setAsis] = useState(initialAsis);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  if (!roster.length) {
    return (
      <Card>
        <p className="muted">
          No hay alumnos en <b>{grupo}</b>.
          {puedeImportar
            ? " Ve a «Gestionar alumnos» para importar el listado desde Excel."
            : " Pide a administración que suba el listado."}
        </p>
      </Card>
    );
  }

  const get = (id) => asis[id] || DEFAULT;
  const set = (id, patch) => setAsis((a) => ({ ...a, [id]: { ...(a[id] || DEFAULT), ...patch } }));

  const cont = { presente: 0, ausente: 0, retraso: 0, justificada: 0 };
  roster.forEach((a) => cont[get(a.id).estado]++);

  const onSave = async () => {
    setSaving(true);
    setMsg("");
    const rows = roster.map((a) => {
      const x = get(a.id);
      return {
        alumno_id: a.id,
        fecha,
        estado: x.estado || "presente",
        nota: x.nota || null,
        profesor: me.docente || me.nombre,
        actualizado: nowISO(),
      };
    });
    try {
      await upsertAsistencia(rows);
      setMsg("Guardado ✓");
    } catch (e) {
      setMsg(`No se pudo guardar: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SelectRow label="Fecha">
        <input type="date" value={fecha} onChange={(e) => onFecha(e.target.value)} style={{ width: "auto" }} />
        <span className="muted">
          {roster.length} alumnos · {cont.presente} presentes, {cont.ausente} ausentes, {cont.retraso} retrasos,{" "}
          {cont.justificada} justif.
        </span>
      </SelectRow>
      <Card style={{ padding: "6px 0" }}>
        <table className="asistab">
          <tbody>
            {roster.map((a) => {
              const cur = get(a.id);
              return (
                <tr key={a.id}>
                  <td className="al-nom">{nombreCompleto(a)}</td>
                  <td className="al-est">
                    {ESTADOS_ASISTENCIA.map(([k, l]) => {
                      const on = cur.estado === k;
                      const [bg, fg] = ESTADO_ASISTENCIA_COL[k];
                      return (
                        <button
                          type="button"
                          key={k}
                          className="estbtn"
                          title={k}
                          aria-pressed={on}
                          style={on ? { background: bg, color: fg, borderColor: fg } : undefined}
                          onClick={() => set(a.id, { estado: k })}
                        >
                          {l}
                        </button>
                      );
                    })}
                  </td>
                  <td className="al-nota">
                    <input
                      placeholder="anotación…"
                      value={cur.nota}
                      onChange={(e) => set(a.id, { nota: e.target.value })}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <SaveBar>
        <button type="button" className="btn primary" onClick={onSave} disabled={saving}>
          {saving ? "Guardando…" : "Guardar asistencia"}
        </button>
        <span className="muted">{msg}</span>
      </SaveBar>
    </>
  );
}
