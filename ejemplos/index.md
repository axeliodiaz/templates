# Introducción {#introduccion}

Ejemplos de pantallas reales construidas con Lustro para un estudio de entrenamiento. Cada rol (Users, Coaches y Admin) tiene su propio recorrido, con menús que se expanden y datos ficticios. La estructura sigue el apartado de ejemplos de [PulseFit Design System](https://pulsefit-sketch.vercel.app/), con el lenguaje visual oscuro de Lustro.

<div class="ex-tabs"><a href="/ejemplos/" aria-current="page">Introducción</a><a href="/ejemplos/users">Users</a><a href="/ejemplos/coaches">Coaches</a><a href="/ejemplos/admin">Admin</a></div>

<div class="ex-grid"><div class="ex-card"><div class="ex-card-h"><b>Users</b><span class=ex-tag>4 grupos</span></div><small>Socios del estudio: reservar clases, ver reservas, membresía y pagos.</small><p><a href="/ejemplos/users">Ver ejemplos de Users</a></p></div><div class="ex-card"><div class="ex-card-h"><b>Coaches</b><span class=ex-tag>4 grupos</span></div><small>Agenda del día, asistencia, notas de sesión y mensajes con socios.</small><p><a href="/ejemplos/coaches">Ver ejemplos de Coaches</a></p></div><div class="ex-card"><div class="ex-card-h"><b>Admin</b><span class=ex-tag>4 grupos</span></div><small>Operación del estudio: ocupación, ingresos, socios y configuración.</small><p><a href="/ejemplos/admin">Ver ejemplos de Admin</a></p></div></div>

## Cómo leer los ejemplos {#como-leer}

1. **Menú expandible:** a la izquierda de cada página, cada grupo se abre y se cierra con Enter o Espacio. Los enlaces saltan a la sección.
2. **Grupos de ejemplos:** cada bloque es un `<details>` nativo. Funciona con teclado y lector de pantalla sin JavaScript.
3. **Datos ficticios:** nombres, montos y horarios son inventados. Ninguno corresponde a una persona real.

## Patrones que se repiten {#patrones}

| Patrón | Dónde aparece | Regla |
|---|---|---|
| Tarjeta de vidrio | Todos los roles | Borde `rgba(148,140,255,.16)`, esquinas de 14px, un solo gradiente por vista |
| Lista con avatar | Reservas, asistentes, socios | Avatar con iniciales, línea secundaria en gris y estado a la derecha |
| Barra de progreso | Cupos, metas, ocupación | Gradiente índigo a rosa, siempre con el número al lado |
| Etiqueta de estado | Reservas, pagos, clases | Texto más color: nunca solo color |
| Tabla con scroll | Admin | Scroll horizontal en móvil, encabezado fijo en gris suave |

Para los componentes sueltos usa el [catálogo completo](/ui-kit). Para pantallas de otros dominios revisa [Messaging](/messaging), [Calendar](/calendar), [Projects](/projects) y [Finance](/finance).
