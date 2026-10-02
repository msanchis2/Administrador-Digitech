/**
 * Horario base del centro (importado de los Excel originales).
 * Se usa como semilla cuando la tabla `horario` de Supabase está vacía y
 * como referencia para «Restablecer al original».
 *
 * Cada clase tiene un `grid[hora][dia] = [asignatura, profesor] | null`.
 */
export const SCHEDULE = {
  "dias": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
  "horas": ["1ª", "2ª", "3ª", "4ª", "5ª", "6ª"],
  "clases": [
    {
      "clase": "1º SMR A",
      "grid": {
        "1ª": {
          "Lunes": ["Montaje y mantenim.", "Jaime"],
          "Martes": ["Inglés", "Lydia"],
          "Miércoles": ["Ofimática", "Marti"],
          "Jueves": ["Redes locales", "Marti"],
          "Viernes": ["Montaje y mantenim.", "Jaime"]
        },
        "2ª": {
          "Lunes": ["Montaje y mantenim.", "Jaime"],
          "Martes": ["Inglés", "Lydia"],
          "Miércoles": ["Ofimática", "Marti"],
          "Jueves": ["Redes locales", "Marti"],
          "Viernes": ["Montaje y mantenim.", "Jaime"]
        },
        "3ª": {
          "Lunes": ["Redes locales", "Marti"],
          "Martes": ["Ofimática", "Marti"],
          "Miércoles": ["Ofimática", "Marti"],
          "Jueves": ["Redes locales", "Marti"],
          "Viernes": ["Montaje y mantenim.", "Jaime"]
        },
        "4ª": {
          "Lunes": ["Ofimática", "Marti"],
          "Martes": ["Redes locales", "Marti"],
          "Miércoles": ["SO monopuesto", "Iván"],
          "Jueves": ["IPE I", "Noelia"],
          "Viernes": ["Montaje y mantenim.", "Jaime"]
        },
        "5ª": {
          "Lunes": ["Ofimática", "Marti"],
          "Martes": ["Redes locales", "Marti"],
          "Miércoles": ["SO monopuesto", "Iván"],
          "Jueves": ["IPE I", "Noelia"],
          "Viernes": ["Montaje y mantenim.", "Jaime"]
        },
        "6ª": {
          "Lunes": ["Redes locales", "Marti"],
          "Martes": ["Ofimática", "Marti"],
          "Miércoles": ["SO monopuesto", "Iván"],
          "Jueves": ["IPE I", "Noelia"],
          "Viernes": ["SO monopuesto", "Iván"]
        }
      }
    },
    {
      "clase": "1º SMR B",
      "grid": {
        "1ª": {
          "Lunes": ["Redes locales", "Marti"],
          "Martes": ["Redes locales", "Marti"],
          "Miércoles": ["SO monopuesto", "Iván"],
          "Jueves": ["SO monopuesto", "Iván"],
          "Viernes": ["Ofimática", "Carmen"]
        },
        "2ª": {
          "Lunes": ["Redes locales", "Marti"],
          "Martes": ["Redes locales", "Marti"],
          "Miércoles": ["IPE I", "Álvaro"],
          "Jueves": ["SO monopuesto", "Iván"],
          "Viernes": ["Ofimática", "Carmen"]
        },
        "3ª": {
          "Lunes": ["Montaje y mantenim.", "Jaime"],
          "Martes": ["Inglés", "Lydia"],
          "Miércoles": ["IPE I", "Álvaro"],
          "Jueves": ["IPE I", "Álvaro"],
          "Viernes": ["Ofimática", "Carmen"]
        },
        "4ª": {
          "Lunes": ["Montaje y mantenim.", "Jaime"],
          "Martes": ["Inglés", "Lydia"],
          "Miércoles": ["Ofimática", "Carmen"],
          "Jueves": ["Redes locales", "Marti"],
          "Viernes": ["SO monopuesto", "Iván"]
        },
        "5ª": {
          "Lunes": ["Montaje y mantenim.", "Jaime"],
          "Martes": ["Montaje y mantenim.", "Jaime"],
          "Miércoles": ["Ofimática", "Carmen"],
          "Jueves": ["Redes locales", "Marti"],
          "Viernes": ["Ofimática", "Carmen"]
        },
        "6ª": {
          "Lunes": ["Montaje y mantenim.", "Jaime"],
          "Martes": ["Montaje y mantenim.", "Jaime"],
          "Miércoles": ["Ofimática", "Carmen"],
          "Jueves": ["Redes locales", "Marti"],
          "Viernes": ["Montaje y mantenim.", "Jaime"]
        }
      }
    },
    {
      "clase": "2º SMR A",
      "grid": {
        "1ª": {
          "Lunes": ["Servicios en red", "Tono"],
          "Martes": ["Servicios en red", "Tono"],
          "Miércoles": ["Servicios en red", "Tono"],
          "Jueves": ["SO en red", "Raúl"],
          "Viernes": ["IPE II", "Álvaro"]
        },
        "2ª": {
          "Lunes": ["Servicios en red", "Tono"],
          "Martes": ["Aplicaciones web", "Noelia"],
          "Miércoles": ["Aplicaciones web", "Noelia"],
          "Jueves": ["SO en red", "Raúl"],
          "Viernes": ["IPE II", "Álvaro"]
        },
        "3ª": {
          "Lunes": ["Seguridad", "Raúl"],
          "Martes": ["Aplicaciones web", "Noelia"],
          "Miércoles": ["Digitalización", "Lydia"],
          "Jueves": ["SO en red", "Raúl"],
          "Viernes": ["IPE II", "Álvaro"]
        },
        "4ª": {
          "Lunes": ["Seguridad", "Raúl"],
          "Martes": ["SO en red", "Raúl"],
          "Miércoles": ["Proyecto", "Lydia"],
          "Jueves": ["Servicios en red", "Tono"],
          "Viernes": ["Servicios en red", "Tono"]
        },
        "5ª": {
          "Lunes": ["Seguridad", "Raúl"],
          "Martes": ["Inglés", "Óscar"],
          "Miércoles": ["Proyecto", "Lydia"],
          "Jueves": ["Servicios en red", "Tono"],
          "Viernes": ["SO en red", "Raúl"]
        },
        "6ª": {
          "Lunes": ["Inglés", "Óscar"],
          "Martes": ["Inglés", "Óscar"],
          "Miércoles": ["Seguridad", "Raúl"],
          "Jueves": ["Sostenibilidad", "Álvaro"],
          "Viernes": ["SO en red", "Raúl"]
        }
      }
    },
    {
      "clase": "2º SMR B",
      "grid": {
        "1ª": {
          "Lunes": ["SO en red", "Raúl"],
          "Martes": ["IPE II", "Noelia"],
          "Miércoles": ["Seguridad", "Raúl"],
          "Jueves": ["IPE II", "Noelia"],
          "Viernes": ["Aplicaciones web", "Noelia"]
        },
        "2ª": {
          "Lunes": ["SO en red", "Raúl"],
          "Martes": ["Servicios en red", "Iván"],
          "Miércoles": ["Seguridad", "Raúl"],
          "Jueves": ["IPE II", "Noelia"],
          "Viernes": ["Aplicaciones web", "Noelia"]
        },
        "3ª": {
          "Lunes": ["Proyecto", "Óscar"],
          "Martes": ["Servicios en red", "Iván"],
          "Miércoles": ["Servicios en red", "Iván"],
          "Jueves": ["Servicios en red", "Iván"],
          "Viernes": ["Proyecto", "Óscar"]
        },
        "4ª": {
          "Lunes": ["Aplicaciones web", "Noelia"],
          "Martes": ["Servicios en red", "Iván"],
          "Miércoles": ["Seguridad", "Raúl"],
          "Jueves": ["SO en red", "Raúl"],
          "Viernes": ["Inglés", "Óscar"]
        },
        "5ª": {
          "Lunes": ["Sostenibilidad", "Noelia"],
          "Martes": ["Servicios en red", "Iván"],
          "Miércoles": ["Seguridad", "Raúl"],
          "Jueves": ["SO en red", "Raúl"],
          "Viernes": ["Inglés", "Óscar"]
        },
        "6ª": {
          "Lunes": ["SO en red", "Raúl"],
          "Martes": ["Servicios en red", "Iván"],
          "Miércoles": ["Digitalización", "Lydia"],
          "Jueves": ["SO en red", "Raúl"],
          "Viernes": ["Inglés", "Óscar"]
        }
      }
    },
    {
      "clase": "1º DAM",
      "grid": {
        "1ª": {
          "Lunes": ["Programación", "David Juan"],
          "Martes": ["Sist. informáticos", "David Juan"],
          "Miércoles": ["Programación", "David Juan"],
          "Jueves": ["Bases de datos", "Carmen"],
          "Viernes": ["Proyecto", "Óscar"]
        },
        "2ª": {
          "Lunes": ["Sist. informáticos", "David Juan"],
          "Martes": ["Sist. informáticos", "David Juan"],
          "Miércoles": ["Bases de datos", "Carmen"],
          "Jueves": ["Bases de datos", "Carmen"],
          "Viernes": ["Lenguajes de marcas", "Iván"]
        },
        "3ª": {
          "Lunes": ["Sist. informáticos", "David Juan"],
          "Martes": ["Sist. informáticos", "David Juan"],
          "Miércoles": ["Bases de datos", "Carmen"],
          "Jueves": ["Inglés", "Lydia"],
          "Viernes": ["Lenguajes de marcas", "Iván"]
        },
        "4ª": {
          "Lunes": ["IPE I", "Álvaro"],
          "Martes": ["Programación", "David Juan"],
          "Miércoles": ["Entornos desarrollo", "Jaime"],
          "Jueves": ["Inglés", "Lydia"],
          "Viernes": ["Programación", "David Juan"]
        },
        "5ª": {
          "Lunes": ["IPE I", "Álvaro"],
          "Martes": ["Programación", "David Juan"],
          "Miércoles": ["Entornos desarrollo", "Jaime"],
          "Jueves": ["Lenguajes de marcas", "Iván"],
          "Viernes": ["Programación", "David Juan"]
        },
        "6ª": {
          "Lunes": ["IPE I", "Álvaro"],
          "Martes": ["Programación", "David Juan"],
          "Miércoles": ["Entornos desarrollo", "Jaime"],
          "Jueves": ["Bases de datos", "Carmen"],
          "Viernes": ["Programación", "David Juan"]
        }
      }
    },
    {
      "clase": "2º DAM A",
      "grid": {
        "1ª": {
          "Lunes": ["Desarrollo interfaces", "Iván"],
          "Martes": ["Prog. multimedia", "Raúl"],
          "Miércoles": ["Acceso a datos", "Belda"],
          "Jueves": ["Proyecto", "Belda"],
          "Viernes": ["Inglés", "Lydia"]
        },
        "2ª": {
          "Lunes": ["Desarrollo interfaces", "Iván"],
          "Martes": ["Prog. multimedia", "Raúl"],
          "Miércoles": ["Acceso a datos", "Belda"],
          "Jueves": ["Acceso a datos", "Belda"],
          "Viernes": ["Inglés", "Lydia"]
        },
        "3ª": {
          "Lunes": ["Desarrollo interfaces", "Iván"],
          "Martes": ["Prog. multimedia", "Raúl"],
          "Miércoles": ["Proyecto", "Belda"],
          "Jueves": ["Acceso a datos", "Belda"],
          "Viernes": ["Inglés", "Lydia"]
        },
        "4ª": {
          "Lunes": ["Prog. servicios/procesos", "Belda"],
          "Martes": ["Sist. gestión empresarial", "Belda"],
          "Miércoles": ["Sostenibilidad", "Álvaro"],
          "Jueves": ["Desarrollo interfaces", "Iván"],
          "Viernes": ["IPE II", "Álvaro"]
        },
        "5ª": {
          "Lunes": ["Prog. servicios/procesos", "Belda"],
          "Martes": ["Sist. gestión empresarial", "Belda"],
          "Miércoles": ["Sist. gestión empresarial", "Belda"],
          "Jueves": ["Digitalización", "Lydia"],
          "Viernes": ["IPE II", "Álvaro"]
        },
        "6ª": {
          "Lunes": ["Desarrollo interfaces", "Iván"],
          "Martes": ["Prog. multimedia", "Raúl"],
          "Miércoles": ["Sist. gestión empresarial", "Belda"],
          "Jueves": ["Proyecto", "Belda"],
          "Viernes": ["IPE II", "Álvaro"]
        }
      }
    },
    {
      "clase": "2º DAM B",
      "grid": {
        "1ª": {
          "Lunes": ["Sist. gestión empresarial", "Belda"],
          "Martes": ["Inglés", "Óscar"],
          "Miércoles": ["Proyecto", "Jaime"],
          "Jueves": ["Desarrollo interfaces", "Tono"],
          "Viernes": ["Prog. multimedia", "Tono"]
        },
        "2ª": {
          "Lunes": ["Sist. gestión empresarial", "Belda"],
          "Martes": ["Inglés", "Óscar"],
          "Miércoles": ["Proyecto", "Jaime"],
          "Jueves": ["Desarrollo interfaces", "Tono"],
          "Viernes": ["Prog. multimedia", "Tono"]
        },
        "3ª": {
          "Lunes": ["Sist. gestión empresarial", "Belda"],
          "Martes": ["Prog. multimedia", "Tono"],
          "Miércoles": ["Proyecto", "Jaime"],
          "Jueves": ["Desarrollo interfaces", "Tono"],
          "Viernes": ["Prog. multimedia", "Tono"]
        },
        "4ª": {
          "Lunes": ["Desarrollo interfaces", "Tono"],
          "Martes": ["IPE II", "Álvaro"],
          "Miércoles": ["Inglés", "Óscar"],
          "Jueves": ["Prog. servicios/procesos", "Belda"],
          "Viernes": ["Acceso a datos", "Belda"]
        },
        "5ª": {
          "Lunes": ["Desarrollo interfaces", "Tono"],
          "Martes": ["IPE II", "Álvaro"],
          "Miércoles": ["Sostenibilidad", "Álvaro"],
          "Jueves": ["Prog. servicios/procesos", "Belda"],
          "Viernes": ["Acceso a datos", "Belda"]
        },
        "6ª": {
          "Lunes": ["Acceso a datos", "Belda"],
          "Martes": ["Acceso a datos", "Belda"],
          "Miércoles": ["IPE II", "Álvaro"],
          "Jueves": ["Digitalización", "Lydia"],
          "Viernes": ["Sist. gestión empresarial", "Belda"]
        }
      }
    },
    {
      "clase": "1º ASIR",
      "grid": {
        "1ª": {
          "Lunes": ["IPE I", "Noelia"],
          "Martes": ["Gestión BD", "Carmen"],
          "Miércoles": ["Gestión BD", "Carmen"],
          "Jueves": ["Inglés", "Lydia"],
          "Viernes": ["Planif. y admin. redes", "Marti"]
        },
        "2ª": {
          "Lunes": ["IPE I", "Noelia"],
          "Martes": ["Implantación SO", "Tono"],
          "Miércoles": ["Implantación SO", "Tono"],
          "Jueves": ["Inglés", "Lydia"],
          "Viernes": ["Planif. y admin. redes", "Marti"]
        },
        "3ª": {
          "Lunes": ["IPE I", "Noelia"],
          "Martes": ["Gestión BD", "Carmen"],
          "Miércoles": ["Implantación SO", "Tono"],
          "Jueves": ["Proyecto", "Carmen"],
          "Viernes": ["Planif. y admin. redes", "Marti"]
        },
        "4ª": {
          "Lunes": ["Lenguajes de marcas", "Iván"],
          "Martes": ["Implantación SO", "Tono"],
          "Miércoles": ["Planif. y admin. redes", "Marti"],
          "Jueves": ["Gestión BD", "Carmen"],
          "Viernes": ["Fund. hardware", "Marti"]
        },
        "5ª": {
          "Lunes": ["Lenguajes de marcas", "Iván"],
          "Martes": ["Implantación SO", "Tono"],
          "Miércoles": ["Planif. y admin. redes", "Marti"],
          "Jueves": ["Gestión BD", "Carmen"],
          "Viernes": ["Fund. hardware", "Marti"]
        },
        "6ª": {
          "Lunes": ["Implantación SO", "Tono"],
          "Martes": ["Implantación SO", "Tono"],
          "Miércoles": ["Planif. y admin. redes", "Marti"],
          "Jueves": ["Lenguajes de marcas", "Iván"],
          "Viernes": ["Fund. hardware", "Marti"]
        }
      }
    },
    {
      "clase": "1º DAW",
      "grid": {
        "1ª": {
          "Lunes": ["Bases de datos", "Carmen"],
          "Martes": ["Lenguajes de marcas", "Iván"],
          "Miércoles": ["IPE I", "Álvaro"],
          "Jueves": ["Programación", "David Juan"],
          "Viernes": ["Sist. informáticos", "David Juan"]
        },
        "2ª": {
          "Lunes": ["IPE I", "Álvaro"],
          "Martes": ["Entornos desarrollo", "Jaime"],
          "Miércoles": ["Lenguajes de marcas", "Iván"],
          "Jueves": ["Programación", "David Juan"],
          "Viernes": ["Sist. informáticos", "David Juan"]
        },
        "3ª": {
          "Lunes": ["Bases de datos", "Carmen"],
          "Martes": ["Entornos desarrollo", "Jaime"],
          "Miércoles": ["Proyecto", "Óscar"],
          "Jueves": ["Programación", "David Juan"],
          "Viernes": ["Sist. informáticos", "David Juan"]
        },
        "4ª": {
          "Lunes": ["Programación", "David Juan"],
          "Martes": ["Entornos desarrollo", "Jaime"],
          "Miércoles": ["Programación", "David Juan"],
          "Jueves": ["IPE I", "Álvaro"],
          "Viernes": ["Bases de datos", "Carmen"]
        },
        "5ª": {
          "Lunes": ["Programación", "David Juan"],
          "Martes": ["Inglés", "Lydia"],
          "Miércoles": ["Programación", "David Juan"],
          "Jueves": ["Sist. informáticos", "David Juan"],
          "Viernes": ["Lenguajes de marcas", "Iván"]
        },
        "6ª": {
          "Lunes": ["Bases de datos", "Carmen"],
          "Martes": ["Inglés", "Lydia"],
          "Miércoles": ["Programación", "David Juan"],
          "Jueves": ["Sist. informáticos", "David Juan"],
          "Viernes": ["Bases de datos", "Carmen"]
        }
      }
    },
    {
      "clase": "2º DAW",
      "grid": {
        "1ª": {
          "Lunes": ["Inglés", "Óscar"],
          "Martes": ["Desarrollo web cliente", "Belda"],
          "Miércoles": ["Inglés", "Óscar"],
          "Jueves": ["IPE II", "Álvaro"],
          "Viernes": ["Desarrollo web cliente", "Belda"]
        },
        "2ª": {
          "Lunes": ["Desarrollo web servidor", "Carmen"],
          "Martes": ["Desarrollo web cliente", "Belda"],
          "Miércoles": ["Inglés", "Óscar"],
          "Jueves": ["IPE II", "Álvaro"],
          "Viernes": ["Desarrollo web cliente", "Belda"]
        },
        "3ª": {
          "Lunes": ["Diseño interfaces web", "Tono"],
          "Martes": ["Desarrollo web cliente", "Belda"],
          "Miércoles": ["Despliegue apps web", "David Juan"],
          "Jueves": ["Sostenibilidad", "Noelia"],
          "Viernes": ["Desarrollo web cliente", "Belda"]
        },
        "4ª": {
          "Lunes": ["Desarrollo web servidor", "Carmen"],
          "Martes": ["Desarrollo web servidor", "Carmen"],
          "Miércoles": ["Proyecto", "Tono"],
          "Jueves": ["Despliegue apps web", "David Juan"],
          "Viernes": ["Digitalización", "Lydia"]
        },
        "5ª": {
          "Lunes": ["Desarrollo web servidor", "Carmen"],
          "Martes": ["Desarrollo web servidor", "Carmen"],
          "Miércoles": ["Proyecto", "Tono"],
          "Jueves": ["IPE II", "Álvaro"],
          "Viernes": ["Diseño interfaces web", "Tono"]
        },
        "6ª": {
          "Lunes": ["Despliegue apps web", "David Juan"],
          "Martes": ["Desarrollo web servidor", "Carmen"],
          "Miércoles": ["Proyecto", "Tono"],
          "Jueves": ["Diseño interfaces web", "Tono"],
          "Viernes": ["Diseño interfaces web", "Tono"]
        }
      }
    },
    {
      "clase": "1º Marketing",
      "grid": {
        "1ª": {
          "Lunes": ["Inglés", "Lydia"],
          "Martes": ["FOL / IPE I", "Álvaro"],
          "Miércoles": ["Inglés", "Lydia"],
          "Jueves": ["Investigación comercial", "Adriana"],
          "Viernes": ["Políticas de marketing", "Roberto"]
        },
        "2ª": {
          "Lunes": ["Inglés", "Lydia"],
          "Martes": ["FOL / IPE I", "Álvaro"],
          "Miércoles": ["Inglés", "Lydia"],
          "Jueves": ["Gestión económica", "Adriana"],
          "Viernes": ["Políticas de marketing", "Roberto"]
        },
        "3ª": {
          "Lunes": ["Gestión económica", "Adriana"],
          "Martes": ["FOL / IPE I", "Álvaro"],
          "Miércoles": ["Gestión económica", "Adriana"],
          "Jueves": ["Investigación comercial", "Adriana"],
          "Viernes": ["Políticas de marketing", "Roberto"]
        },
        "4ª": {
          "Lunes": ["Políticas de marketing", "Roberto"],
          "Martes": ["Marketing digital", "Reme"],
          "Miércoles": ["Marketing digital", "Reme"],
          "Jueves": ["Investigación comercial", "Adriana"],
          "Viernes": ["Políticas de marketing", "Roberto"]
        },
        "5ª": {
          "Lunes": ["Políticas de marketing", "Roberto"],
          "Martes": ["Marketing digital", "Reme"],
          "Miércoles": ["Marketing digital", "Reme"],
          "Jueves": ["Gestión económica", "Adriana"],
          "Viernes": ["Políticas de marketing", "Roberto"]
        },
        "6ª": {
          "Lunes": ["Políticas de marketing", "Roberto"],
          "Martes": ["Marketing digital", "Reme"],
          "Miércoles": ["Proyecto", "Reme"],
          "Jueves": ["Investigación comercial", "Adriana"],
          "Viernes": ["Políticas de marketing", "Roberto"]
        }
      }
    },
    {
      "clase": "2º Marketing",
      "grid": {
        "1ª": {
          "Lunes": ["Proyecto", "Belén"],
          "Martes": ["Diseño material comunic.", "Belén"],
          "Miércoles": ["RRPP y eventos", "Belén"],
          "Jueves": ["Lanzamiento productos", "Roberto"],
          "Viernes": ["Trabajo de campo", "Adriana"]
        },
        "2ª": {
          "Lunes": ["Diseño material comunic.", "Belén"],
          "Martes": ["Sostenibilidad", "Belén"],
          "Miércoles": ["Diseño material comunic.", "Belén"],
          "Jueves": ["Lanzamiento productos", "Roberto"],
          "Viernes": ["Medios y soportes", "Adriana"]
        },
        "3ª": {
          "Lunes": ["Digitalización", "Lydia"],
          "Martes": ["RRPP y eventos", "Belén"],
          "Miércoles": ["Diseño material comunic.", "Belén"],
          "Jueves": ["Lanzamiento productos", "Roberto"],
          "Viernes": ["Trabajo de campo", "Adriana"]
        },
        "4ª": {
          "Lunes": ["Inglés", "Lydia"],
          "Martes": ["Proyecto", "Belén"],
          "Miércoles": ["IPE II", "Noelia"],
          "Jueves": ["Atención al cliente", "Reme"],
          "Viernes": ["Trabajo de campo", "Adriana"]
        },
        "5ª": {
          "Lunes": ["Inglés", "Lydia"],
          "Martes": ["RRPP y eventos", "Belén"],
          "Miércoles": ["IPE II", "Noelia"],
          "Jueves": ["Atención al cliente", "Reme"],
          "Viernes": ["Medios y soportes", "Adriana"]
        },
        "6ª": {
          "Lunes": ["Inglés", "Lydia"],
          "Martes": ["Diseño material comunic.", "Belén"],
          "Miércoles": ["IPE II", "Noelia"],
          "Jueves": ["Atención al cliente", "Reme"],
          "Viernes": ["Medios y soportes", "Adriana"]
        }
      }
    }
  ]
};

export const DIAS = SCHEDULE.dias;
export const HORAS = SCHEDULE.horas;

export const PERIOD_TIME = {
  "1ª": "8:30–9:25",
  "2ª": "9:25–10:20",
  "3ª": "10:20–11:15",
  "4ª": "11:45–12:40",
  "5ª": "12:40–13:35",
  "6ª": "13:35–14:30",
};

/** Índice de la hora antes de la cual se pinta el recreo. */
export const RECREO_ANTES_DE = 3;
export const RECREO_LABEL = "RECREO · 11:15–11:45";
