import { useState } from "react";
import { Card, Loading, Message, TextArea } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { CARGA_VACIA } from "@/utils/schedule";
import DatosCard from "./components/DatosCard";
import DisponibilidadCard from "./components/DisponibilidadCard";
import FichaResumen from "./components/FichaResumen";
import HabilitacionCard from "./components/HabilitacionCard";
import PerfilCard from "./components/PerfilCard";
import ProfesorChips from "./components/ProfesorChips";
import { useFichas } from "./useFichas";
import "./fichas.css";

export default function FichasPage() {
  const { me } = useAuth();
  const { canEditFichas: editGestion } = usePermissions();
  const { loading, cargas, nombres, getFicha, updateFicha } = useFichas();
  const [sel, setSel] = useState(null);

  if (loading) return <Loading text="Cargando fichas…" />;

  // Por defecto, la ficha propia (si la cuenta está vinculada) o la primera.
  const n = sel && cargas[sel] ? sel : me.docente && cargas[me.docente] ? me.docente : nombres[0];
  if (!n) return <Loading text="No hay profesorado en el horario." />;

  const ficha = getFicha(n);
  const own = me.docente === n;
  const editPersonal = editGestion || own;
  const onChange = (patch) => updateFicha(n, patch);

  return (
    <>
      {!editGestion &&
        (own ? (
          <Message variant="ok" style={{ marginBottom: 14 }}>
            Esta es tu ficha. Puedes editar tu perfil personal (foto, presentación, enlaces, titulación y experiencia).
            Lo de planificación lo gestiona el centro.
          </Message>
        ) : (
          <Message variant="warn" style={{ marginBottom: 14 }}>
            Solo consulta. Cada profesor edita su propia ficha; la gestión general la lleva el equipo directivo.
          </Message>
        ))}

      <ProfesorChips nombres={nombres} selected={n} onSelect={setSel} getFicha={getFicha} miNombre={me.docente} />
      <FichaResumen ficha={ficha} carga={cargas[n] || CARGA_VACIA} />
      <PerfilCard ficha={ficha} editable={editPersonal} onChange={onChange} />
      <DatosCard ficha={ficha} editPersonal={editPersonal} editGestion={editGestion} onChange={onChange} />
      <HabilitacionCard
        habilitacion={ficha.habilitacion}
        editable={editGestion}
        onChange={(habilitacion) => onChange({ habilitacion })}
      />
      <DisponibilidadCard
        bloqueos={ficha.bloqueos}
        editable={editGestion}
        onChange={(bloqueos) => onChange({ bloqueos })}
      />
      {editGestion && (
        <Card title="Notas internas">
          <TextArea minHeight={70} value={ficha.notas} onChange={(e) => onChange({ notas: e.target.value })} />
        </Card>
      )}
    </>
  );
}
