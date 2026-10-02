import { useState } from "react";
import { Card, Field, Loading } from "@/components/ui";
import { TIPOS_AUSENCIA } from "@/constants/ausencias";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import { usePermissions } from "@/hooks/usePermissions";
import { deleteAusencia, fetchAusencias, insertAusencia } from "@/services/ausencias";
import { rangoFechas } from "@/utils/format";

const VACIO = { tipo: "Vacaciones", ini: "", fin: "", motivo: "" };

export default function AusenciasPage() {
  const { me } = useAuth();
  const { veTodasLasAusencias } = usePermissions();
  const toast = useToast();
  const { data: list, setData: setList, loading } = useAsyncData(() => fetchAusencias().catch(() => []), [], []);
  const [form, setForm] = useState(VACIO);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (loading) return <Loading />;

  const mias = list.filter((a) => a.user_id === me.id);

  const add = async () => {
    if (!form.ini) return toast("Pon al menos la fecha de inicio");
    try {
      const nueva = await insertAusencia({
        user_id: me.id,
        nombre: me.nombre,
        tipo: form.tipo,
        fecha_inicio: form.ini,
        fecha_fin: form.fin || null,
        motivo: form.motivo || null,
      });
      setList((l) => [nueva, ...l]);
      setForm((f) => ({ ...VACIO, tipo: f.tipo }));
      toast("Registrada");
    } catch (e) {
      toast(`No se pudo: ${e.message}`);
    }
  };

  const quitar = async (id) => {
    try {
      await deleteAusencia(id);
      setList((l) => l.filter((x) => x.id !== id));
    } catch (e) {
      toast(`No se pudo: ${e.message}`);
    }
  };

  return (
    <>
      <Card title="Registrar ausencia o vacaciones">
        <div className="row3">
          <Field label="Tipo">
            <select value={form.tipo} onChange={set("tipo")}>
              {TIPOS_AUSENCIA.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Desde">
            <input type="date" value={form.ini} onChange={set("ini")} />
          </Field>
          <Field label="Hasta">
            <input type="date" value={form.fin} onChange={set("fin")} />
          </Field>
          <Field label="Motivo (opcional)" style={{ gridColumn: "span 2" }}>
            <input value={form.motivo} onChange={set("motivo")} />
          </Field>
          <Field style={{ alignSelf: "end" }}>
            <button type="button" className="btn primary btn-block" onClick={add}>
              Añadir
            </button>
          </Field>
        </div>
      </Card>

      <Card title={`Mis ausencias (${mias.length})`}>
        {mias.length ? (
          <table>
            <tbody>
              {mias.map((a) => (
                <tr key={a.id}>
                  <td>
                    <b>{a.tipo}</b>
                  </td>
                  <td className="mono">{rangoFechas(a.fecha_inicio, a.fecha_fin, "")}</td>
                  <td>{a.motivo || ""}</td>
                  <td style={{ textAlign: "right" }}>
                    <button type="button" className="btn ghost" onClick={() => quitar(a.id)}>
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">No has registrado ninguna.</p>
        )}
      </Card>

      {veTodasLasAusencias && (
        <Card title={`Todo el personal (${list.length})`}>
          {list.length ? (
            <table>
              <thead>
                <tr>
                  <th>Persona</th>
                  <th>Tipo</th>
                  <th>Fechas</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id}>
                    <td>{a.nombre || ""}</td>
                    <td>{a.tipo}</td>
                    <td className="mono">{rangoFechas(a.fecha_inicio, a.fecha_fin, "")}</td>
                    <td>{a.motivo || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="muted">Sin registros.</p>
          )}
        </Card>
      )}
    </>
  );
}
