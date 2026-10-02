import { profCol } from "@/utils/schedule";

export default function Avatar({ nombre, foto, big = false }) {
  const cls = `favatar${big ? " big" : ""}`;
  if (foto) {
    return (
      <div
        className={cls}
        style={{ backgroundImage: `url('${foto}')`, backgroundSize: "cover", backgroundPosition: "center" }}
        role="img"
        aria-label={nombre}
      />
    );
  }
  return (
    <div className={cls} style={{ background: profCol(nombre) }}>
      {nombre.slice(0, 1)}
    </div>
  );
}
