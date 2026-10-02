import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "@/services/auth";

const AuthContext = createContext(null);

/**
 * status: "loading" → comprobando sesión · "anon" → sin sesión · "authed" → `me` cargado.
 */
export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [me, setMe] = useState(null);

  const enter = useCallback(async (user) => {
    const profile = await authService.loadProfile(user);
    setMe(profile);
    setStatus("authed");
  }, []);

  useEffect(() => {
    let alive = true;
    authService
      .getSession()
      .then((session) => {
        if (!alive) return;
        if (session) return enter(session.user);
        setStatus("anon");
      })
      .catch(() => alive && setStatus("anon"));

    // Solo escuchamos el cierre de sesión: el inicio lo gestiona `login`.
    const sub = authService.onAuthChange((session) => {
      if (!session) {
        setMe(null);
        setStatus("anon");
      }
    });
    return () => {
      alive = false;
      sub.unsubscribe();
    };
  }, [enter]);

  const login = useCallback(
    async (email, password) => {
      const { user } = await authService.signIn(email, password);
      await enter(user);
    },
    [enter],
  );

  const logout = useCallback(() => authService.signOut(), []);

  const value = useMemo(() => ({ status, me, login, logout }), [status, me, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
