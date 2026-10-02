import { useState } from "react";
import { Card, Field, Message } from "@/components/ui";
import { CREATE_USER_FN_URL } from "@/config/env";
import { ROLES } from "@/constants/roles";
import { createUser } from "@/services/usuarios";

const VACIO = { nombre: "", email: "", rol: "profesor", password: "" };

export default function NuevoUsuarioForm({ onCreated }) {
  const [form, setForm] = useState(VACIO);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const crear = async () => {
    setMsg(null);
    const nombre = form.nombre.trim();
    const email = form.email.trim();
    if (!nombre || !email || form.password.length < 6) {
      return setMsg(["err", "Completa nombre, correo y contraseña de al menos 6 caracteres."]);
    }
    if (!CREATE_USER_FN_URL) {
      return setMsg([
        "warn",
        "Crea la cuenta en Supabase (Authentication → Add user) y luego ajusta su rol y permiso en la tabla de abajo.",
      ]);
    }
    setBusy(true);
    try {
      await createUser({ email, password: form.password, nombre, rol: form.rol });
      setMsg(["ok", `Cuenta creada para ${nombre}.`]);
      setForm(VACIO);
      onCreated();
    } catch (e) {
      setMsg(["err", e.message]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Añadir profesor/a">
      <div className="row3">
        <Field label="Nombre">
          <input placeholder="Nombre y apellidos" value={form.nombre} onChange={set("nombre")} />
        </Field>
        <Field label="Correo">
          <input type="email" placeholder="correo@centro.es" value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Rol">
          <select value={form.rol} onChange={set("rol")}>
            {ROLES.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="row3" style={{ marginTop: 10 }}>
        <Field label="Contraseña provisional">
          <input placeholder="mínimo 6 caracteres" value={form.password} onChange={set("password")} />
        </Field>
        <div />
        <div>
          <button type="button" className="btn primary btn-block" onClick={crear} disabled={busy}>
            {busy ? "Creando…" : "Crear cuenta"}
          </button>
        </div>
      </div>
      {msg && <Message variant={msg[0]}>{msg[1]}</Message>}
      {!CREATE_USER_FN_URL && (
        <p className="muted" style={{ marginTop: 12 }}>
          Para crear cuentas desde aquí hay que desplegar la función admin-create-user y poner su URL en{" "}
          <code>VITE_CREATE_USER_FN_URL</code>. Mientras, créala en Supabase (Authentication → Add user) y ajusta aquí
          su rol y permisos.
        </p>
      )}
    </Card>
  );
}
