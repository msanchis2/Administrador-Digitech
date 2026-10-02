import { lazy, Suspense } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import RequireSection from "@/components/layout/RequireSection";
import { Loading } from "@/components/ui";
import { firstVisiblePath, PUBLIC_SURVEY_PATH, SECTIONS } from "@/config/navigation";
import { isConfigured } from "@/config/env";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { HorarioProvider } from "@/context/HorarioContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { usePermissions } from "@/hooks/usePermissions";
import ConfigNeeded from "@/features/auth/ConfigNeeded";
import FullPageLoading from "@/features/auth/FullPageLoading";
import LoginPage from "@/features/auth/LoginPage";
import PublicSurveyPage from "@/features/encuesta/PublicSurveyPage";

// Cada sección se descarga solo cuando se visita.
const PAGES = {
  horarios: lazy(() => import("@/features/horarios/HorariosPage")),
  fichas: lazy(() => import("@/features/fichas/FichasPage")),
  evaluacion: lazy(() => import("@/features/evaluacion/EvaluacionPage")),
  alumnado: lazy(() => import("@/features/alumnado/AlumnadoPage")),
  ausencias: lazy(() => import("@/features/ausencias/AusenciasPage")),
  calendario: lazy(() => import("@/features/calendario/CalendarioPage")),
  practicas: lazy(() => import("@/features/practicas/PracticasPage")),
  empresas: lazy(() => import("@/features/empresas/EmpresasPage")),
  informes: lazy(() => import("@/features/informes/InformesPage")),
  encuesta: lazy(() => import("@/features/encuesta/SurveyPage")),
  usuarios: lazy(() => import("@/features/usuarios/UsuariosPage")),
};

function PrivateRoutes() {
  const { me } = useAuth();
  const perms = usePermissions();
  const home = firstVisiblePath(perms, me);
  return (
    <HorarioProvider>
      <Routes>
        <Route element={<AppLayout />}>
          {Object.entries(PAGES).map(([key, Page]) => (
            <Route
              key={key}
              path={`${SECTIONS[key].path}/*`}
              element={
                <RequireSection section={key}>
                  <Suspense fallback={<Loading />}>
                    <Page />
                  </Suspense>
                </RequireSection>
              }
            />
          ))}
          <Route path="*" element={<Navigate to={home} replace />} />
        </Route>
      </Routes>
    </HorarioProvider>
  );
}

function AppRoutes() {
  const { status } = useAuth();
  return (
    <Routes>
      {/* La encuesta pública no requiere iniciar sesión. */}
      <Route path={PUBLIC_SURVEY_PATH} element={<PublicSurveyPage />} />
      <Route
        path="*"
        element={status === "loading" ? <FullPageLoading /> : status === "anon" ? <LoginPage /> : <PrivateRoutes />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        {isConfigured ? (
          <AuthProvider>
            <HashRouter>
              <AppRoutes />
            </HashRouter>
          </AuthProvider>
        ) : (
          <ConfigNeeded />
        )}
      </ToastProvider>
    </ThemeProvider>
  );
}
