const acc = () => ({ s: 0, n: 0 });
const add = (o, v) => {
  o.s += v;
  o.n++;
};
const avg = (o) => (o.n ? o.s / o.n : null);

/** Media ponderada de pares [peso, valor]; null si no hay pares. */
const weighted = (pairs) => {
  if (!pairs.length) return null;
  const sw = pairs.reduce((s, p) => s + p[0], 0) || 1;
  return pairs.reduce((s, p) => s + p[0] * p[1], 0) / sw;
};

/** Agrega las respuestas de la encuesta de un profesor. */
export function aggEval(respuestas, teacher) {
  const R = respuestas.filter((r) => r.profesor === teacher);
  const alum = {};
  const cD = acc(),
    cP = acc(),
    ad = acc(),
    fa = acc();
  const counts = { Alumnado: 0, Familia: 0, Coordinación: 0, Administración: 0 };
  R.forEach((r) => {
    counts[r.colectivo] = (counts[r.colectivo] || 0) + 1;
    if (r.colectivo === "Alumnado" && r.docente != null) {
      const k = `${r.asignatura}||${r.grado}`;
      alum[k] = alum[k] || acc();
      add(alum[k], r.docente);
    }
    if (r.colectivo === "Coordinación") {
      if (r.docente != null) add(cD, r.docente);
      if (r.profesional != null) add(cP, r.profesional);
    }
    if (r.colectivo === "Administración" && r.profesional != null) add(ad, r.profesional);
    if (r.colectivo === "Familia" && r.familia != null) add(fa, r.familia);
  });
  const alumAvg = Object.fromEntries(Object.entries(alum).map(([k, o]) => [k, avg(o)]));
  return { alum: alumAvg, coordDoc: avg(cD), coordProf: avg(cP), admin: avg(ad), fam: avg(fa), counts, n: R.length };
}

/** Calcula nota global, docente, profesional y por asignatura/grado. */
export function computeVal({ units, respuestas, weights: W }, teacher) {
  const ag = aggEval(respuestas, teacher);
  const uni = [];
  (units[teacher] || []).forEach((u) => {
    const a = ag.alum[`${u.asig}||${u.grado}`];
    if (a == null) return;
    const famW = u.grado === "Medio" ? W.famGM : W.famGS;
    const parts = [[Math.max(0, 1 - famW - W.coordDoc), a]];
    if (ag.coordDoc != null) parts.push([W.coordDoc, ag.coordDoc]);
    if (ag.fam != null) parts.push([famW, ag.fam]);
    uni.push({ asig: u.asig, grado: u.grado, ses: u.ses, nota: weighted(parts) });
  });

  const wavg = (arr) => {
    const s = arr.reduce((x, u) => x + u.ses, 0);
    return s ? arr.reduce((x, u) => x + u.nota * u.ses, 0) / s : null;
  };
  const docente = uni.length ? wavg(uni) : null;

  const porGrado = {};
  ["Medio", "Superior"].forEach((g) => {
    const sub = uni.filter((u) => u.grado === g);
    if (sub.length) porGrado[g] = wavg(sub);
  });

  const prof = [];
  if (ag.admin != null) prof.push([W.admin, ag.admin]);
  if (ag.coordProf != null) prof.push([W.coordProf, ag.coordProf]);
  const profesional = weighted(prof);

  const glob = [];
  if (docente != null) glob.push([W.global, docente]);
  if (profesional != null) glob.push([1 - W.global, profesional]);
  const global = weighted(glob);

  return { global, docente, profesional, porGrado, unidades: uni, counts: ag.counts, n: ag.n };
}

/** Texto orientativo sobre en qué grado rinde mejor. */
export function gradeHint(porGrado) {
  const { Medio, Superior } = porGrado;
  if (Medio == null || Superior == null) return "";
  const r = Math.round;
  const d = Medio - Superior;
  if (Math.abs(d) < 3) return `Rinde de forma similar en ambos grados (${r(Medio)} / ${r(Superior)}).`;
  const [hi, lo] = d > 0 ? ["Medio", "Superior"] : ["Superior", "Medio"];
  return `Encaja mejor en grado ${hi} (${r(porGrado[hi])}) que en ${lo} (${r(porGrado[lo])}).`;
}

/** Media 0–100 de las valoraciones (1–5) de unas preguntas. */
export function to100(ratings, items) {
  const v = items.map((i) => ratings[i]).filter(Boolean);
  return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 20) : null;
}
