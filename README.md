# Malla · Panel del centro

Panel de gestión del centro (horarios, profesorado, evaluación docente, alumnado y asistencia, calendario escolar, prácticas FCT, empresas, informes, encuesta y usuarios) construido con **React + Vite** sobre **Supabase**.

Es la migración del antiguo `index.html` monolítico (≈1500 líneas con HTML en _template strings_ y estado global) a un proyecto React organizado por funcionalidades.

## Puesta en marcha

Requisitos: **Node 20.19+** (o 22+).

```bash
npm install
cp .env.example .env      # y rellena tus credenciales de Supabase
npm run dev               # http://localhost:5173
```

| Script            | Qué hace                                       |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga en caliente |
| `npm run build`   | Compila a `dist/` para producción              |
| `npm run preview` | Sirve `dist/` en local para probar el build    |
| `npm run lint`    | ESLint (incluye las reglas de React Hooks)     |
| `npm run format`  | Formatea el código con Prettier                |

### Variables de entorno (`.env`)

| Variable                  | Obligatoria | Descripción                                                              |
| ------------------------- | ----------- | ------------------------------------------------------------------------ |
| `VITE_SUPABASE_URL`       | Sí          | URL del proyecto (`https://xxxx.supabase.co`)                            |
| `VITE_SUPABASE_ANON_KEY`  | Sí          | Clave pública _publishable/anon_                                         |
| `VITE_CREATE_USER_FN_URL` | No          | URL de la Edge Function `admin-create-user` para crear cuentas en la app |

La clave _anon_ viaja al navegador por diseño: la seguridad la ponen las políticas **RLS** de Supabase. `.env` está en `.gitignore`.

Si faltan las variables, la app muestra la pantalla «Casi listo» en lugar de romperse.

## Despliegue

`npm run build` genera una web estática en `dist/` con rutas relativas (`base: "./"`) y navegación por _hash_ (`#/horarios`), así que funciona en cualquier hosting estático (Netlify, Vercel, GitHub Pages, un servidor Apache…) **sin configurar reescrituras** y también dentro de una subcarpeta.

Recuerda definir las variables `VITE_*` en el panel del hosting antes de compilar.

### Enlaces

- Panel: `https://tu-dominio/`
- Encuesta pública (sin login): `https://tu-dominio/#/publica/encuesta`
  Los enlaces antiguos `#encuesta` y `?encuesta=1` se redirigen automáticamente.

## Estructura

```
src/
├── main.jsx                 # Punto de entrada (+ redirección de enlaces antiguos)
├── App.jsx                  # Proveedores + rutas (cada sección se carga bajo demanda)
├── config/
│   ├── env.js               # Lectura de variables VITE_*
│   └── navigation.js        # Secciones, grupos del menú y quién ve cada una
├── lib/supabase.js          # Cliente único de Supabase
├── services/                # TODO el acceso a datos, un módulo por tabla
│   ├── client.js            #   unwrap() lanza los errores de Supabase
│   ├── auth.js  horario.js  docentes.js  encuesta.js  alumnos.js
│   └── calendario.js  empresas.js  practicas.js  ausencias.js  usuarios.js
├── context/
│   ├── AuthContext.jsx      # Sesión y perfil (`me`)
│   ├── HorarioContext.jsx   # Horario compartido + edición con deshacer
│   ├── ThemeContext.jsx     # Modo claro/oscuro (persistido)
│   └── ToastContext.jsx     # Avisos breves
├── hooks/
│   ├── usePermissions.js    # Permisos derivados del rol
│   └── useAsyncData.js      # Carga + estado `loading` + recarga silenciosa
├── data/schedule.js         # Horario base (semilla y «restablecer al original»)
├── constants/               # Catálogos de dominio (roles, ciclos, estados…)
├── utils/                   # Lógica pura y testeable
│   ├── schedule.js          #   conflictos, huecos, compactar, cargas por profesor
│   ├── evaluacion.js        #   agregación y ponderación de la encuesta
│   ├── excel.js             #   lectura/exportación (xlsx cargado bajo demanda)
│   ├── image.js  format.js
├── components/
│   ├── layout/              # Header, menú, guardas de ruta
│   ├── schedule/            # WeekGrid (rejilla días×horas) y leyenda
│   └── ui/                  # Card, Field, Chip, Message, SegmentedTabs…
├── features/                # Una carpeta por sección: página, componentes, hooks y CSS
│   ├── auth/  horarios/  fichas/  evaluacion/  encuesta/  alumnado/
│   └── calendario/  empresas/  practicas/  ausencias/  informes/  usuarios/
└── styles/                  # Tokens, base, layout, piezas compartidas y modo oscuro
```

**Convenciones**

- Los componentes no hablan con Supabase directamente: llaman a `services/*`.
- La lógica de negocio (conflictos de horario, notas de evaluación, parseo de Excel) vive en `utils/` como funciones puras, separada de la UI.
- Cada feature trae su propio CSS; lo global está en `src/styles/`. Se mantienen los mismos nombres de clase que el original.
- Alias `@/` → `src/`.

## Edición del horario

Quien tenga permiso (admin o `edita_horarios`) ve el botón **✏️ Editar horario**. En modo edición aparece una barra con **Deshacer**, **Guardar cambios** y **Salir / Descartar y salir**. Los cambios no se guardan hasta pulsar «Guardar», y se conservan aunque cambies de sección. Al guardar, el horario se actualiza para todo el centro, y como las vistas «Por clase» y «Por profesor» se calculan a partir del mismo horario, siempre coinciden.

- **Por clase**: pulsa una sesión y luego una casilla verde para moverla, u otra sesión para intercambiarlas. También tienes «Compactar» y «Restablecer al original».
- **Por profesor**: pulsa una sesión del profesor y muévela a una franja verde, es decir, una en la que el profesor y ese grupo están libres a la vez.
- **Asignaturas**: tabla profesor → grupo → asignatura → horas.
  - **Quitar** borra del horario todas las horas de esa asignatura con ese profesor en ese grupo.
  - **Añadir** coloca automáticamente las horas indicadas en los huecos compatibles. Prefiere rellenar huecos entre clases y hacer bloques seguidos, sin poner más de 3 h de la asignatura el mismo día.

Una casilla es válida solo si el grupo está libre, el profesor no da clase a esa hora en otro grupo y no la tiene marcada como **no disponible** en su ficha (Profesorado → Disponibilidad horaria).

Para añadir una asignatura se exige además que:

1. ningún otro profesor la imparta ya en ese grupo (ni el mismo profesor);
2. el profesor tenga suficientes **horas libres**: franjas en las que no da clase y no está bloqueado;
3. haya suficientes franjas en las que **coinciden libres** el profesor y el grupo.

## Roles y permisos

| Sección             | Quién la ve                                                                                               |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| Horarios            | Todos (botón «Editar horario»: admin o `edita_horarios`)                                                  |
| Profesorado         | Todos (cada docente edita su perfil; gestión: admin o `edita_fichas`)                                     |
| Evaluación          | Admin, coordinación y administración (pesos: solo admin)                                                  |
| Alumnado            | Todos (gestión ve todos los grupos; un profesor, solo los suyos). Importar/editar: admin y administración |
| Ausencias           | Todos (gestión ve las de todo el personal)                                                                |
| Calendario          | Todos (editar: admin, coordinación y administración)                                                      |
| Prácticas           | Admin, administración y docentes vinculados (vista de tutor)                                              |
| Empresas / Informes | Admin y administración                                                                                    |
| Encuesta            | Todos (y pública sin login)                                                                               |
| Usuarios            | Solo admin                                                                                                |

## Tablas de Supabase que usa

`profiles`, `horario`, `docentes`, `respuestas`, `config`, `alumnos`, `asistencia`, `cursos`, `calendario`, `empresas`, `practicas`, `ausencias`. Las consultas son las mismas que en el `index.html` original, así que no hace falta tocar la base de datos.

## Cambios respecto al `index.html` original

Mismo aspecto y mismo comportamiento, con estos arreglos:

- **Escenario «2º en FCT» y horas de 1º/2º**: el horario base no trae el campo `curso`, así que antes no se atenuaba nada y en las fichas todas las horas contaban como «de 2º». Ahora el curso se deduce del nombre de la clase («1º DAM» → 1).
- **Calendario**: la creación automática del curso 2026/27 es idempotente (antes, dos cargas simultáneas podían duplicarlo).
- **Cambios de horario sin guardar** se conservan al cambiar de pestaña (viven en `HorarioContext`).
- **Enlaces LinkedIn/Web**: solo se aceptan `http(s)`; un `javascript:` ya no es clicable.
- **Fecha de hoy** en hora local (antes UTC: entre las 00:00 y las 02:00 la asistencia se apuntaba en el día anterior).
- Los **toasts** ahora tienen estilo (la clase `.toast` no existía en el CSS original).
- **Móvil**: la rejilla del horario se desplaza en horizontal en lugar de desbordar la página.
- La evaluación calcula cada profesor una sola vez por render (antes, dos veces por chip).
- `xlsx` se descarga solo al importar o exportar (≈140 kB gzip menos en la carga inicial) y cada sección se carga bajo demanda.

## Nota sobre `xlsx`

Se usa `xlsx@0.18.5`, la misma versión que cargaba el original por CDN. Tiene dos avisos de seguridad conocidos (prototype pollution y ReDoS al **leer** ficheros maliciosos). SheetJS ya no publica en npm; para pasar a la versión corregida:

```bash
npm install https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

No requiere cambios de código.
