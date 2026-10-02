import EstadoPill from "@/features/practicas/components/EstadoPill";
import { Card, Loading, StatsRow } from "@/components/ui";
import { ESTADOS_PRACTICA } from "@/constants/practicas";
import { useToast } from "@/context/ToastContext";
import { useAsyncData } from "@/hooks/useAsyncData";
import { fetchAlumnosActivos } from "@/services/alumnos";
import { fetchEmpresas } from "@/services/empresas";
import { fetchPracticas } from "@/services/practicas";
import { exportXLSX } from "@/utils/excel";
import { alumnosRows, empresasRows, practicasRows } from "./exportadores";

const EMPTY = { alumnos: [], empresas: [], practicas: [] };

export default function InformesPage() {
  const toast = useToast();
  const { data, loading } = useAsyncData(
    async () => {
      const [alumnos, empresas, practicas] = await Promise.all([
        fetchAlumnosActivos().catch(() => []),
        fetchEmpresas().catch(() => []),
        fetchPracticas().catch(() => []),
      ]);
      return { alumnos, empresas, practicas };
    },
    [],
    EMPTY,
  );

  if (loading) return <Loading text="Cargando informes…" />;

  const { alumnos, empresas, practicas } = data;
  const porEstado = Object.fromEntries(ESTADOS_PRACTICA.map((e) => [e, 0]));
  practicas.forEach((p) => (porEstado[p.estado] = (porEstado[p.estado] || 0) + 1));
  const conEmpresa = practicas.filter((p) => p.empresa_id).length;

  const exportar = async (rows, nombre) => {
    if (!rows.length) return toast("No hay datos para exportar");
    try {
      await exportXLSX(rows, nombre);
    } catch (e) {
      toast(`No se pudo exportar: ${e.message}`);
    }
  };

  return (
    <>
      <StatsRow
        items={[
          ["Alumnos", alumnos.length],
          ["Empresas", empresas.length],
          ["Prácticas", practicas.length],
          ["Con empresa", conEmpresa],
          ["Sin empresa", practicas.length - conEmpresa],
        ]}
      />
      <Card title="Prácticas por estado">
        <table>
          <tbody>
            {ESTADOS_PRACTICA.map((e) => (
              <tr key={e}>
                <td>
                  <EstadoPill estado={e} />
                </td>
                <td className="mono">{porEstado[e] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card title="Exportar a Excel">
        <p className="muted">Descarga los datos en un archivo .xlsx para trabajarlos o guardarlos.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn" onClick={() => exportar(alumnosRows(alumnos), "alumnos")}>
            Alumnos
          </button>
          <button type="button" className="btn" onClick={() => exportar(empresasRows(empresas), "empresas")}>
            Empresas
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => exportar(practicasRows(practicas, alumnos, empresas), "practicas")}
          >
            Prácticas
          </button>
        </div>
      </Card>
    </>
  );
}
