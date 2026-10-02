import { useState } from "react";
import { Field, Message } from "@/components/ui";
import CenteredCard from "@/components/layout/CenteredCard";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) return setError("Introduce correo y contraseña.");
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <CenteredCard>
      <div className="logo">M</div>
      <h1>Malla</h1>
      <p className="sub">Acceso al centro · Curso 2026/27</p>
      <form onSubmit={onSubmit} noValidate>
        <Field label="Correo">
          <input
            type="email"
            autoComplete="username"
            placeholder="tu-correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Contraseña">
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <button type="submit" className="btn primary btn-block" disabled={busy}>
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
      {error && <Message variant="err">{error}</Message>}
    </CenteredCard>
  );
}
