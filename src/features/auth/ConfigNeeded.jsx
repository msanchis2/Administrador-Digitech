import CenteredCard from "@/components/layout/CenteredCard";
import { Message } from "@/components/ui";

export default function ConfigNeeded() {
  return (
    <CenteredCard>
      <div className="logo">M</div>
      <h1>Casi listo</h1>
      <p className="sub">Falta conectar con la base de datos.</p>
      <Message variant="warn">
        Copia <code>.env.example</code> como <code>.env</code>, rellena <code>VITE_SUPABASE_URL</code> y{" "}
        <code>VITE_SUPABASE_ANON_KEY</code> y vuelve a arrancar <code>npm run dev</code>.
      </Message>
    </CenteredCard>
  );
}
