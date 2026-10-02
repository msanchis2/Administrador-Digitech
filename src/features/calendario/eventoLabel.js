import { TIPO_CAL } from "@/constants/calendario";

/** Título del evento o, si no tiene, el nombre de su tipo. */
export const eventoLabel = (e) => e.titulo || (TIPO_CAL[e.tipo] || TIPO_CAL.evento)[2];
