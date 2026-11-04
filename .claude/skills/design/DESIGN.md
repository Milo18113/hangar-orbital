# DESIGN.md · Hangar Orbital

Sistema de diseño **«Consola de Hangar»**, versión 1.0 (noviembre 2026).

Este archivo es la fuente de verdad de cómo se **ve** y se **siente** la app. No define funcionalidad: qué hace la app lo dicen el PRD, las historias y las specs. Cuando una tarea toque la interfaz, el agente lee este archivo antes de escribir código.

## 1. Cómo se usa este archivo

| Pregunta | Respuesta |
| --- | --- |
| ¿Quién lo lee? | Todo el equipo y el agente. `AGENTS.md` lo referencia para cualquier tarea visual. |
| ¿Qué decide? | Tokens (color, tipografía, espaciado), componentes, layout, accesibilidad y reglas de estilo. |
| ¿Qué no decide? | Reglas de negocio, textos de la app ni comportamiento. Esos viven en `docs/specs/` y en `src/dominio/`. |
| ¿Cómo se relaciona con una spec? | La spec de interfaz cita tokens y componentes **por su nombre** (`--color-no-apta`, «Tarjeta de nave»). No copia valores. |
| ¿Cómo se cambia? | Se edita este archivo y `src/styles/tokens.css` en el mismo commit, con un mensaje `docs(diseño): …`. |
| ¿Qué pasa si choca con una spec? | Gana la spec en lo que hace la app; gana este archivo en cómo se ve. Si la duda persiste, se pregunta antes de implementar. |

## 2. Principios

1. **La aptitud se lee de un vistazo.** Lo primero que ve un jefe de hangar en cada nave es si puede despegar. El detalle viene después.
2. **Nunca solo color.** Todo estado lleva texto («Apta», «No apta», «En reparación»). El color refuerza; no informa por sí solo.
3. **Densidad de consola.** Información compacta y alineada. Las cifras van en tipografía monoespaciada para que se comparen en columna.
4. **Un solo acento.** El cian marca lo que se puede hacer (botones, foco, enlaces). Rojo, verde y ámbar se reservan para estados de las naves.
5. **Plano y en calma.** Sin sombras, gradientes ni animaciones decorativas. La jerarquía sale del color de la superficie, del tamaño y del espacio.

## 3. Decisiones de diseño

| Decisión | Por qué |
| --- | --- |
| Tema oscuro único | Los jefes trabajan en el hangar, frente a pantallas de control. El fondo oscuro hace que los estados de color resalten sin cansar la vista. |
| IBM Plex en tres variantes | Una sola familia con tono técnico. La condensada ahorra ancho en títulos y etiquetas; la mono alinea cifras. |
| Tarjetas en lugar de tabla | Cada nave es una unidad con estado propio. La tarjeta permite poner la aptitud arriba a la derecha, siempre en el mismo lugar. |
| Umbrales leídos del dominio | La barra de combustible y el contador de misiones dibujan los límites con `COMBUSTIBLE_MINIMO` y `MAX_MISIONES_SIN_REVISION`. Si la regla cambia, la interfaz cambia sola. |
| CSS plano con variables | El proyecto no usa librerías de estilos. Las variables CSS bastan para un sistema pequeño y no añaden dependencias. |

## 4. Tokens

Todos los tokens viven en `src/styles/tokens.css`, dentro de `:root`. Ningún otro archivo escribe un color, una fuente o un tamaño literal.

### 4.1 Color

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-fondo` | `#0E1420` | Fondo de la página |
| `--color-superficie` | `#161E2E` | Paneles y tarjetas |
| `--color-superficie-alta` | `#1F2A3F` | Campos de formulario, elementos sobre una tarjeta |
| `--color-borde` | `#2C3A54` | Separadores decorativos y borde de tarjetas |
| `--color-borde-control` | `#6B7C9E` | Borde de campos y controles (contraste 3,4:1 sobre su fondo) |
| `--color-texto` | `#E8EEF7` | Texto principal |
| `--color-texto-suave` | `#A3B1C8` | Texto secundario, etiquetas, ayudas |
| `--color-acento` | `#6CC4FF` | Botón primario, foco, enlaces |
| `--color-sobre-acento` | `#0E1420` | Texto sobre el acento |
| `--color-apta` | `#46D39A` | Estado «Apta» y combustible suficiente |
| `--color-apta-fondo` | `#163A2F` | Fondo de la insignia «Apta» y del aviso de éxito |
| `--color-no-apta` | `#FF6B6B` | Estado «No apta», combustible bajo y errores |
| `--color-no-apta-fondo` | `#3D1E26` | Fondo de la insignia «No apta» y del aviso de error |
| `--color-reparacion` | `#F2B84B` | Estado «En reparación» |
| `--color-reparacion-fondo` | `#3A2E17` | Fondo de la insignia «En reparación» |

Contrastes comprobados (WCAG 2.1):

| Combinación | Contraste | Nivel |
| --- | --- | --- |
| `--color-texto` sobre `--color-superficie` | 14,3:1 | AAA |
| `--color-texto-suave` sobre `--color-superficie` | 7,7:1 | AAA |
| `--color-sobre-acento` sobre `--color-acento` | 9,6:1 | AAA |
| `--color-apta` sobre `--color-apta-fondo` | 6,6:1 | AA |
| `--color-no-apta` sobre `--color-no-apta-fondo` | 5,4:1 | AA |
| `--color-reparacion` sobre `--color-reparacion-fondo` | 7,4:1 | AAA |
| `--color-no-apta` sobre `--color-superficie-alta` (errores de campo) | 5,2:1 | AA |
| `--color-borde-control` sobre `--color-superficie-alta` | 3,4:1 | Contraste de controles (1.4.11) |

### 4.2 Tipografía

Se cargan desde Google Fonts en `index.html`, con `display=swap`.

| Token | Valor | Uso |
| --- | --- | --- |
| `--fuente-titulo` | `"IBM Plex Sans Condensed", "Arial Narrow", sans-serif` | Títulos, nombres de nave, etiquetas en mayúsculas |
| `--fuente-texto` | `"IBM Plex Sans", system-ui, sans-serif` | Texto, campos, botones |
| `--fuente-cifras` | `"IBM Plex Mono", ui-monospace, monospace` | Porcentajes, conteos, fechas, clases de nave |

| Token | Tamaño | Peso | Uso |
| --- | --- | --- | --- |
| `--texto-xl` | 1.75rem (28 px) | 600, `--fuente-titulo` | Título de la app |
| `--texto-lg` | 1.25rem (20 px) | 600, `--fuente-titulo` | Títulos de sección y nombre de nave |
| `--texto-base` | 1rem (16 px) | 400 | Texto e inputs |
| `--texto-sm` | 0.875rem (14 px) | 400 o 600 | Etiquetas de campo, motivos, mensajes de error |
| `--texto-xs` | 0.75rem (12 px) | 600, mayúsculas, espaciado 0.06em | Etiquetas de dato («COMBUSTIBLE», «CLASE») |

Interlineado: 1.5 en texto, 1.2 en títulos. Las cifras usan `font-variant-numeric: tabular-nums`.

### 4.3 Espaciado, radios y bordes

| Token | Valor |
| --- | --- |
| `--espacio-1` | 4px |
| `--espacio-2` | 8px |
| `--espacio-3` | 12px |
| `--espacio-4` | 16px |
| `--espacio-6` | 24px |
| `--espacio-8` | 32px |
| `--espacio-12` | 48px |
| `--radio-sm` | 4px (insignias, campos, botones) |
| `--radio-md` | 8px (tarjetas y paneles) |
| `--borde` | `1px solid var(--color-borde)` |

Todo espacio sale de esta escala. Los grupos de elementos se separan con `gap` en flex o grid, no con márgenes sueltos.

### 4.4 Movimiento

- `--duracion-corta: 120ms` con `ease-out`, solo para hover y foco.
- Con `prefers-reduced-motion: reduce`, todas las transiciones se desactivan.
- Nada se anima al cargar la página.

## 5. Layout

- **Encabezado:** «Hangar Orbital» en `--texto-xl` y, debajo, «Control de despegues» en `--color-texto-suave`.
- **Tablero (≥ 900 px):** dos columnas dentro de un contenedor de máximo 1200 px.
  - Izquierda, 360 px fijos: panel «Registrar nave» y, debajo, panel «Asignar misión».
  - Derecha, el resto: sección «Flota», con las tarjetas en una grilla `repeat(auto-fill, minmax(260px, 1fr))`.
- **Pantalla angosta (< 900 px):** una sola columna, en el mismo orden. Margen lateral de `--espacio-4`.
- Nunca hay scroll horizontal, ni a 390 px de ancho.

## 6. Componentes

Las clases de CSS van en español y en kebab-case (`tarjeta-nave`, `insignia--apta`). Los estilos viven en `src/styles/`.

### 6.1 Panel

Contenedor de cada sección. Fondo `--color-superficie`, `--borde`, `--radio-md`, relleno `--espacio-6`. El título del panel es un `h2` en `--texto-lg`.

### 6.2 Campo de formulario

- Etiqueta visible encima del campo, en `--texto-sm` y peso 600. Siempre asociada con `for` / `id`.
- Campo de 40 px de alto mínimo, fondo `--color-superficie-alta`, borde `1px solid var(--color-borde-control)`, `--radio-sm`.
- **Foco:** borde `--color-acento` y contorno `2px solid var(--color-acento)` separado 2 px.
- **Error:** borde `--color-no-apta`, `aria-invalid="true"` y el mensaje debajo, en `--color-no-apta` y `--texto-sm`, enlazado con `aria-describedby`.
- El texto de cada error es el de la spec 01. Este archivo no lo cambia.

### 6.3 Botón

| Variante | Aspecto | Uso |
| --- | --- | --- |
| Primario | Fondo `--color-acento`, texto `--color-sobre-acento`, peso 600 | Acción principal del panel: «Registrar nave», «Asignar misión» |
| Secundario | Fondo transparente, borde `--color-borde-control`, texto `--color-texto` | Acciones de apoyo |

- Alto mínimo 40 px, relleno horizontal `--espacio-4`, `--radio-sm`.
- **Enviando:** el botón se deshabilita y baja su opacidad a 0.6, sin cambiar de ancho.
- El foco sigue la misma regla que en los campos.

### 6.4 Insignia de estado

Etiqueta corta con texto obligatorio. Fuente `--fuente-titulo`, `--texto-xs`, mayúsculas, `--radio-sm`.

| Variante | Texto | Color | Fondo |
| --- | --- | --- | --- |
| `insignia--apta` | Apta | `--color-apta` | `--color-apta-fondo` |
| `insignia--no-apta` | No apta | `--color-no-apta` | `--color-no-apta-fondo` |
| `insignia--reparacion` | En reparación | `--color-reparacion` | `--color-reparacion-fondo` |

«Operativa» no lleva insignia: se muestra como texto en `--color-texto-suave`. Solo se destaca lo excepcional.

### 6.5 Barra de combustible

- Pista de 8 px de alto en `--color-superficie-alta`, con el relleno proporcional al porcentaje.
- Relleno en `--color-apta` si el combustible alcanza el mínimo, y en `--color-no-apta` si no.
- Una marca vertical de 2 px en `--color-texto-suave` indica el umbral, en la posición `COMBUSTIBLE_MINIMO` %.
- A la derecha, el valor en `--fuente-cifras`: «62 %».
- Accesibilidad: `role="meter"`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow` y `aria-label="Combustible"`.
- El umbral se importa de `src/dominio/aptitud.ts`. Nunca se escribe 25 a mano en un componente.

### 6.6 Contador de misiones

- Texto «Misiones desde la revisión» en `--texto-xs` y el valor «2 de 3» en `--fuente-cifras`.
- A su lado, tantas marcas cuadradas de 10 px como indique `MAX_MISIONES_SIN_REVISION`. Las ocupadas se rellenan con `--color-texto`; las libres llevan solo borde.
- El máximo se importa del dominio, igual que el umbral de combustible.

### 6.7 Tarjeta de nave

Orden fijo de arriba abajo:

1. **Cabecera:** nombre de la nave en `--texto-lg` a la izquierda; insignia de aptitud a la derecha.
2. **Clase:** en `--fuente-cifras`, `--texto-xs`, mayúsculas, color `--color-texto-suave`. Las clases no tienen color propio.
3. **Barra de combustible.**
4. **Contador de misiones.**
5. **Estado:** «Operativa» en texto suave, o la insignia «En reparación».
6. **Motivos:** solo si la nave no es apta. Lista en `--texto-sm` con los textos de `MENSAJES_MOTIVO`.

Fondo `--color-superficie`, `--borde`, `--radio-md`, relleno `--espacio-4`, separación interna `--espacio-3`. La flota es una lista (`ul` con un `li` por tarjeta).

### 6.8 Avisos

| Tipo | Estilo | Rol |
| --- | --- | --- |
| Éxito | Fondo `--color-apta-fondo`, borde `1px solid var(--color-apta)`, texto `--color-texto` | `role="status"` |
| Error | Fondo `--color-no-apta-fondo`, borde `1px solid var(--color-no-apta)`, texto `--color-texto` | `role="alert"` |

Aparecen debajo del botón del formulario que los produjo.

### 6.9 Estados de la flota

| Estado | Cómo se ve | Texto (spec 01) |
| --- | --- | --- |
| Cargando | Texto en `--color-texto-suave` dentro de la sección | «Cargando la flota…» |
| Vacío | Panel con borde punteado `--color-borde` y texto centrado | «Todavía no hay naves registradas.» |
| Error | Aviso de error | «No se pudo cargar la flota.» |

## 7. Accesibilidad

- Contraste mínimo AA (4,5:1 en texto, 3:1 en bordes de controles). Los valores de la sección 4.1 ya lo cumplen.
- Foco visible en todo elemento interactivo; nunca `outline: none` sin reemplazo.
- Objetivos táctiles de 40 × 40 px como mínimo.
- Toda la app se puede usar solo con teclado, en el orden en que se lee.
- `lang="es"` en `index.html`.

## 8. Reglas para el agente

**Haz:**

- Usa solo tokens: `var(--color-…)`, `var(--espacio-…)`, `var(--texto-…)`.
- Escribe CSS plano en `src/styles/`: `tokens.css`, `base.css` y un archivo por componente si hace falta. Impórtalos desde `src/main.tsx`.
- Importa los umbrales desde `src/dominio/aptitud.ts`.
- Conserva todos los textos de la spec 01, carácter por carácter.
- Comprueba el resultado a 1280 px y a 390 px de ancho.

**No hagas:**

- No escribas colores hexadecimales fuera de `src/styles/tokens.css`.
- No añadas Tailwind, librerías de componentes, CSS-in-JS ni estilos en línea (`style={…}`), salvo el ancho del relleno de la barra de combustible.
- No toques `src/dominio/`, `src/services/` ni `supabase/` en una tarea visual.
- No uses el color como única señal de un estado.
- No añadas sombras, gradientes, fuentes nuevas ni iconos de librerías.

## 9. Criterios verificables de diseño

La spec de interfaz convierte estas reglas en criterios con id. Unas se comprueban con un comando y otras mirando la pantalla.

| # | Criterio | Cómo se comprueba |
| --- | --- | --- |
| D-01 | Ningún archivo de `src/` fuera de `tokens.css` contiene un color hexadecimal. | Comando: `grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.css --include=*.tsx`, que solo debe listar `tokens.css` |
| D-02 | No hay estilos en línea, salvo el ancho de la barra de combustible. | Comando: `grep -rn "style={" src` |
| D-03 | Cada nave muestra su aptitud con insignia y texto, en la esquina superior derecha de su tarjeta. | Navegador |
| D-04 | Una nave no apta muestra sus motivos con los textos de `MENSAJES_MOTIVO`. | Navegador |
| D-05 | La barra marca el umbral y se pinta en rojo por debajo de él. | Navegador, con una nave al 10 % y otra al 25 % |
| D-06 | El contador muestra «n de 3» y tantas marcas como el máximo del dominio. | Navegador y revisión de código |
| D-07 | Al recorrer la app con Tab, todo control muestra el foco en cian. | Navegador, solo con teclado |
| D-08 | Un campo con error tiene borde rojo, mensaje debajo y `aria-invalid="true"`. | Navegador e inspector |
| D-09 | A 1280 px el tablero tiene dos columnas; a 390 px, una, sin scroll horizontal. | Navegador, con el modo responsive |
| D-10 | Los textos visibles coinciden con los de la spec 01. | Navegador, contra `docs/VERIFICACION.md` |
