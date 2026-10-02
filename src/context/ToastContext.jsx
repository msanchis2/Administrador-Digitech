import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(() => {});
const DURATION = 2200;
const MAX_VISIBLE = 4;

/** Avisos breves apilados en la esquina inferior. `useToast()` devuelve `toast(texto)`. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const toast = useCallback((text) => {
    const id = ++nextId.current;
    setToasts((ts) => [...ts, { id, text }].slice(-MAX_VISIBLE));
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), DURATION);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
