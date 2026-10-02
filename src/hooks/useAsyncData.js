import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Carga datos asíncronos y los expone junto a `setData` para poder aplicar
 * cambios optimistas en local sin volver a pedirlos.
 *
 * @param {() => Promise<any>} loader función de carga
 * @param {any[]} deps valores primitivos que, al cambiar, relanzan la carga
 * @param {any} initial valor inicial y valor si la carga falla
 *
 * `reload()` vuelve a cargar pasando por `loading`; `reload({ silent: true })`
 * recarga sin desmontar la vista (útil tras crear/importar algo).
 */
export function useAsyncData(loader, deps, initial = null) {
  const loaderRef = useRef(loader);
  const initialRef = useRef(initial);
  useEffect(() => {
    loaderRef.current = loader;
  });

  const [version, setVersion] = useState(0);
  const [silentTick, setSilentTick] = useState(0);
  // Clave de la petición «visible»: cambia con las dependencias o con un reload normal.
  const reqKey = `${JSON.stringify(deps)}#${version}`;

  const [state, setState] = useState({ key: null, data: initial, error: null });

  useEffect(() => {
    let alive = true;
    loaderRef.current().then(
      (data) => alive && setState({ key: reqKey, data, error: null }),
      (error) => alive && setState({ key: reqKey, data: initialRef.current, error }),
    );
    return () => {
      alive = false;
    };
  }, [reqKey, silentTick]);

  const reload = useCallback(({ silent = false } = {}) => {
    if (silent) setSilentTick((t) => t + 1);
    else setVersion((v) => v + 1);
  }, []);

  const setData = useCallback((upd) => {
    setState((s) => ({ ...s, data: typeof upd === "function" ? upd(s.data) : upd }));
  }, []);

  return { data: state.data, error: state.error, loading: state.key !== reqKey, setData, reload };
}
