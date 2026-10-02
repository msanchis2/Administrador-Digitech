import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PUBLIC_SURVEY_PATH } from "./config/navigation";
import "./styles/index.css";

// Compatibilidad con los enlaces antiguos a la encuesta (#encuesta o ?encuesta=1).
const params = new URLSearchParams(window.location.search);
if (window.location.hash === "#encuesta" || params.get("encuesta") === "1") {
  window.history.replaceState(null, "", `${window.location.pathname}#${PUBLIC_SURVEY_PATH}`);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
