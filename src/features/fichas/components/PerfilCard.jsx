import { Card, Field, FileButton, TextArea } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { resizeImage } from "@/utils/image";
import Avatar from "./Avatar";

export default function PerfilCard({ ficha, editable, onChange }) {
  const toast = useToast();
  const onFoto = async (file) => {
    try {
      onChange({ foto: await resizeImage(file) });
    } catch {
      toast("No se pudo leer la imagen");
    }
  };
  return (
    <Card title="Perfil personal">
      <div className="perfilrow">
        <div>
          <Avatar nombre={ficha.nombre} foto={ficha.foto} big />
          {editable && (
            <div className="fotobtns">
              <FileButton accept="image/*" onFile={onFoto}>
                Cambiar foto
              </FileButton>
              {ficha.foto && (
                <button type="button" className="btn ghost" onClick={() => onChange({ foto: "" })}>
                  Quitar
                </button>
              )}
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <Field label="Presentación">
            <TextArea
              placeholder="Una breve presentación…"
              value={ficha.presentacion}
              disabled={!editable}
              onChange={(e) => onChange({ presentacion: e.target.value })}
            />
          </Field>
          <div className="row3">
            <Field label="LinkedIn">
              <input
                value={ficha.linkedin}
                placeholder="https://linkedin.com/in/…"
                disabled={!editable}
                onChange={(e) => onChange({ linkedin: e.target.value })}
              />
            </Field>
            <Field label="Web / portfolio">
              <input
                value={ficha.web}
                placeholder="https://…"
                disabled={!editable}
                onChange={(e) => onChange({ web: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </div>
    </Card>
  );
}
