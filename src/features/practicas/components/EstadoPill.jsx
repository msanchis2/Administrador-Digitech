import { StatusPill } from "@/components/ui";
import { ESTADO_PRACTICA_COL } from "@/constants/practicas";

export default function EstadoPill({ estado }) {
  return <StatusPill colors={ESTADO_PRACTICA_COL[estado]}>{estado}</StatusPill>;
}
