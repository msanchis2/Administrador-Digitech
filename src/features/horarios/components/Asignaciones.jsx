import { useMemo, useState } from "react";
import { Card, SelectRow } from "@/components/ui";
import { useHorario } from "@/context/HorarioContext";
import { useToast } from "@/context/ToastContext";
import { DIAS, HORAS, SCHEDULE } from "@/data/schedule";
import {
  anadirAsignatura,
  asignacionesDe,
  cargaProfesor,
  quitarAsignatura,
  todasLasAsignaturas,
} from "@/utils/asignaciones";
import { byLocale } from "@/utils/format";
import { cicloDe } from "@/utils/schedule";
import AsignacionForm from "./AsignacionForm";

const franja = ({ d, h }) => `${d.slice(0, 3)} ${h}`;
const porDiaYHora = (a, b) => DIAS.indexOf(a.d) - DIAS.indexOf(b.d) || HORAS.indexOf(a.h) - HORAS.indexOf(b.h);

/**
 * Tabla profesor → grupo → asignatura → horas. En modo edición permite quitar
 * asignaturas (desaparecen del horario) y añadirlas (se colocan en huecos libres).
 */
export default function Asignaciones({ clases, bloqueos, profesores, editing, prof, onProf }) {
  const { mutate } = useHorario();
  const toast = useToast();
  const [filtro, setFiltro] = useState(prof || "");

  const asignaturas = useMemo(
    () => [...new Set([...todasLasAsignaturas(clases), ...todasLasAsignaturas(SCHEDULE.clases)])].sort(byLocale),
    [clases],
  );
  const lista = filtro ? [filtro] : profesores;

  const onAdd = (datos) => {
    let colocadas;
    const res = mutate((next) => {
      const r = anadirAsignatura(next, bloqueos, datos);
      if (typeof r === "string") return r;
      colocadas = r;
    });
    if (typeof res === "string") {
      toast(res);
      return false;
    }
    toast(
      `«${datos.asig}» añadida a ${datos.prof} en ${datos.clase}: ${colocadas.sort(porDiaYHora).map(franja).join(", ")}`,
    );
    return true;
  };

  const onQuitar = (p, a) => {
    if (!window.confirm(`¿Quitar «${a.asig}» a ${p} en ${a.clase}? Se borrarán sus ${a.horas} h del horario.`)) return;
    mutate((next) => {
      quitarAsignatura(next, { prof: p, clase: a.clase, asig: a.asig });
    });
    toast(`«${a.asig}» quitada de ${a.clase}`);
  };

  return (
    <>
      {editing ? (
        <AsignacionForm
          key={filtro || "todos"}
          clases={clases}
          bloqueos={bloqueos}
          profesores={profesores}
          asignaturas={asignaturas}
          profInicial={filtro || prof}
          onAdd={onAdd}
        />
      ) : (
        <p className="muted">
          Consulta de asignaturas por profesor. Pulsa <b>Editar horario</b> para asignar o quitar.
        </p>
      )}

      <SelectRow label="Mostrar">
        <select
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            if (e.target.value) onProf(e.target.value);
          }}
        >
          <option value="">Todos los profesores</option>
          {profesores.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </SelectRow>

      <Card style={{ padding: "6px 0" }}>
        <table className="asigtab">
          <thead>
            <tr>
              <th>Profesor/a</th>
              <th>Grupo</th>
              <th>Asignatura</th>
              <th style={{ textAlign: "right" }}>Horas</th>
              {editing && <th />}
            </tr>
          </thead>
          {lista.map((p) => {
            const rows = asignacionesDe(clases, p);
            const { impartidas, libres } = cargaProfesor(clases, bloqueos, p);
            const span = Math.max(rows.length, 1);
            const cabecera = (
              <td rowSpan={span} className="asig-prof">
                <b>{p}</b>
                <span className="muted">
                  {impartidas} h · {libres} libres
                </span>
              </td>
            );
            return (
              <tbody key={p}>
                {rows.length ? (
                  rows.map((a, i) => {
                    const cy = cicloDe(a.clase);
                    return (
                      <tr key={`${a.clase}||${a.asig}`}>
                        {i === 0 && cabecera}
                        <td>
                          <span className="dot" style={{ background: cy.c }} />
                          {a.clase}
                        </td>
                        <td>{a.asig}</td>
                        <td className="mono" style={{ textAlign: "right" }}>
                          {a.horas}
                        </td>
                        {editing && (
                          <td style={{ textAlign: "right" }}>
                            <button type="button" className="btn ghost" onClick={() => onQuitar(p, a)}>
                              Quitar
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    {cabecera}
                    <td colSpan={editing ? 4 : 3} className="muted">
                      Sin asignaturas
                    </td>
                  </tr>
                )}
              </tbody>
            );
          })}
        </table>
      </Card>
    </>
  );
}
