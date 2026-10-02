import { Card, Loading, Message } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import { fetchProfiles } from "@/services/usuarios";
import NuevoUsuarioForm from "./components/NuevoUsuarioForm";
import UsuariosTable from "./components/UsuariosTable";

export default function UsuariosPage() {
  const { me } = useAuth();
  const { data: users, setData, loading, error, reload } = useAsyncData(fetchProfiles, [], []);

  if (loading) return <Loading text="Cargando usuarios…" />;
  if (error) {
    return (
      <Card>
        <Message variant="err">{error.message}</Message>
      </Card>
    );
  }

  const onPatch = (id, changes) => setData((us) => us.map((u) => (u.id === id ? { ...u, ...changes } : u)));

  return (
    <>
      <NuevoUsuarioForm onCreated={() => reload({ silent: true })} />
      <UsuariosTable users={users} meId={me.id} onPatch={onPatch} />
    </>
  );
}
