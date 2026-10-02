/** Botón que abre el selector de archivos. Llama a `onFile(file)` y resetea el input. */
export default function FileButton({ children, accept, onFile, className = "btn" }) {
  return (
    <label className={className} style={{ cursor: "pointer" }}>
      {children}
      <input
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}
