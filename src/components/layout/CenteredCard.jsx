/** Tarjeta centrada a pantalla completa (login, configuración, carga). */
export default function CenteredCard({ children }) {
  return (
    <div className="wrap">
      <div className="login">{children}</div>
    </div>
  );
}
