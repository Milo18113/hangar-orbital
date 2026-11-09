# Spec 02 · Interfaz «Consola de Hangar»

- **Historia:** HU-1.2 (consultar la flota), y la presentación de los formularios de HU-1.1 y HU-1.3.
- **Origen:** [docs/backlog/E1-flota-y-misiones.md](../backlog/E1-flota-y-misiones.md) y [DESIGN.md](../../DESIGN.md).
- **Tickets:** T-08 a T-11.
- **Alcance:** aplicar [DESIGN.md](../../DESIGN.md) a las pantallas de la [spec 01](01-flota-y-misiones.md). El tablero de referencia es [docs/design/brand-board.html](../design/brand-board.html).
- **Fuera de alcance:** funcionalidad nueva, y cualquier cambio en `src/dominio/`, `src/services/` o `supabase/`.

## 0. Decisiones de esta spec
1. **Sin Tailwind.** `DESIGN.md` manda en cómo se ve la app y exige CSS plano con variables.
2. **La flota pasa de tabla a lista de tarjetas**, como pide «Tarjeta de nave». Los datos y los textos de la spec 01 no cambian.
3. **La marca de umbral es un SVG.** Su posición sale de `COMBUSTIBLE_MINIMO` sin usar estilos en línea, así que la única excepción a D-02 sigue siendo el ancho del relleno.
4. **Texto nuevo:** «Control de despegues», en el encabezado, como pide `DESIGN.md` §5. El resto de los textos es de la spec 01.
5. **Esta spec no copia valores de `DESIGN.md`.** Cita componentes y tokens por su nombre; si un valor cambia, cambia solo en `DESIGN.md` y en `tokens.css`.
6. **Las fuentes vienen de Google Fonts.** Sin conexión se usan las de respaldo de `--fuente-titulo`, `--fuente-texto` y `--fuente-cifras`, y eso no cuenta como fallo.

## 1. Componentes de DESIGN.md por parte de la pantalla
Los nombres son los de `DESIGN.md` §5 y §6.

| Parte de la pantalla | Componentes que usa |
|---|---|
| Encabezado («Hangar Orbital» y «Control de despegues») | Layout: «Encabezado» |
| Contenedor de la pantalla | Layout: «Tablero» (dos columnas desde el corte de §5, una por debajo) |
| «Registrar nave» | «Panel», «Campo de formulario», «Botón» primario y «Avisos» |
| «Asignar misión» | «Panel», «Campo de formulario», «Botón» primario y «Avisos» (éxito, y error con los motivos de `MENSAJES_MOTIVO`) |
| «Flota» (la lista) | «Estados de la flota» (cargando, vacío y error) |
| Cada nave de la flota | «Tarjeta de nave», que contiene «Insignia de estado», «Barra de combustible» y «Contador de misiones» |

## 2. Archivos de `src/styles/` y cómo se importan

| Archivo | Contiene | Lo crea |
|---|---|---|
| `src/styles/tokens.css` | Todos los tokens de `DESIGN.md` §4, dentro de `:root`. Es el único archivo con valores literales de color, fuente y tamaño | T-08 |
| `src/styles/base.css` | Estilos base de los elementos (cuerpo, títulos, párrafos) y la regla de movimiento reducido | T-08 |
| `src/styles/componentes.css` | El layout (§5) y los componentes (§6), con clases en español y kebab-case | T-09, y T-10 y T-11 le añaden secciones |

- **Importación:** `src/main.tsx` importa, en este orden, `tokens.css`, `base.css` y `componentes.css`. Los tokens van primero porque las otras dos hojas usan sus variables.
- **Fuentes:** `index.html` carga IBM Plex Sans Condensed, IBM Plex Sans e IBM Plex Mono desde Google Fonts, con `display=swap`.

## 3. Criterios de aceptación

### HU-1.2 · Consultar la flota
- **HU-1.2-CA1:** la flota DEBE mostrar todas las naves registradas, cada una con su nombre, clase, combustible, misiones desde la última revisión y si está operativa o en reparación. NO DEBE omitir ninguna nave.
- **HU-1.2-CA2:** la flota DEBE mostrar las naves ordenadas por nombre.
- **HU-1.2-CA3:** cada nave DEBE mostrar su aptitud («Apta» o «No apta») sin que el jefe pulse nada y siempre en el mismo lugar. La aptitud NO DEBE depender solo del color.
- **HU-1.2-CA4:** una nave no apta DEBE mostrar todos sus motivos, con los textos de `MENSAJES_MOTIVO`. Una nave apta NO DEBE mostrar motivos.
- **HU-1.2-CA5:** cada nave DEBE mostrar su combustible en porcentaje, DEBE marcar el mínimo de `COMBUSTIBLE_MINIMO` y DEBE distinguir si está por debajo de él. Una nave con exactamente el mínimo NO DEBE aparecer por debajo. El mínimo NO DEBE escribirse a mano en un componente.
- **HU-1.2-CA6:** cada nave DEBE mostrar sus misiones como «n de 3», donde el máximo sale de `MAX_MISIONES_SIN_REVISION`. El máximo NO DEBE escribirse a mano en un componente.
- **HU-1.2-CA7:** una nave en reparación DEBE mostrar «En reparación», y una operativa DEBE mostrar «Operativa».
- **HU-1.2-CA8:** al registrar una nave o asignar una misión, la flota DEBE actualizarse sin recargar la página.
- **HU-1.2-CA9:** sin naves registradas, la flota DEBE mostrar «Todavía no hay naves registradas.».
- **HU-1.2-CA10:** mientras la flota carga, DEBE mostrar «Cargando la flota…».
- **HU-1.2-CA11:** si la flota no se puede cargar, DEBE mostrar «No se pudo cargar la flota.» y NO DEBE mostrar ninguna nave, ni siquiera una lista parcial.
- **HU-1.2-CA12:** la pantalla DEBE poder consultarse a 1280 px y a 390 px de ancho, y NO DEBE tener scroll horizontal en ninguna de las dos.

### Criterios de DESIGN.md
Aplican los diez criterios D-01 a D-10 de `DESIGN.md` §9, tal como están escritos allí. Esta spec no los copia.

| Criterios | A qué se aplican |
|---|---|
| D-01, D-02 | Todo `src/` |
| D-03, D-04, D-05, D-06 | «Tarjeta de nave» y sus partes |
| D-07, D-08 | Los formularios y el recorrido con teclado de toda la pantalla |
| D-09 | «Tablero» |
| D-10 | Todos los textos visibles |

### Criterios propios de esta spec
- **I-01:** cada campo con error DEBE enlazar su mensaje con `aria-describedby`.
- **I-02:** `npm test` y `npm run build` DEBEN pasar sin tocar `src/dominio/` ni `src/services/`.

## 4. Verificación por criterio
- **Comando:** se ejecuta en la terminal y su salida se compara con lo esperado.
- **Navegador:** prueba en la app real, contra Supabase. Los pasos están en [docs/VERIFICACION-UI.md](../VERIFICACION-UI.md), en la fila indicada.
- **Revisión de código:** se lee el archivo indicado.

| Criterio | Verificación | Qué se comprueba | Fila |
|---|---|---|---|
| HU-1.2-CA1 | Navegador | Con cinco naves, la flota las muestra todas con nombre, clase, combustible, misiones y estado. | U-06 |
| HU-1.2-CA2 | Navegador | Registradas en desorden, las naves se ven ordenadas por nombre. | U-06 |
| HU-1.2-CA3 | Navegador | La aptitud se lee con palabras y en el mismo lugar de cada nave, también con los colores desactivados. | U-07 |
| HU-1.2-CA4 | Navegador | Cada nave no apta lista sus motivos con los textos de `MENSAJES_MOTIVO`; las aptas no. | U-08 |
| HU-1.2-CA5 | Navegador y revisión de código | Con un 10 % y un 25 %, solo la primera queda por debajo del mínimo; `BarraCombustible.tsx` importa el mínimo del dominio. | U-09 |
| HU-1.2-CA6 | Navegador y revisión de código | «0 de 3» y «3 de 3»; `ContadorMisiones.tsx` importa el máximo del dominio. | U-10 |
| HU-1.2-CA7 | Navegador | «En reparación» frente a «Operativa». | U-11 |
| HU-1.2-CA8 | Navegador | Registrar una nave y asignar una misión actualiza la flota sin recargar. | U-12 |
| HU-1.2-CA9 | Navegador | Con las tablas vacías, aparece el texto de flota vacía. | U-05 |
| HU-1.2-CA10 | Navegador | Con la red lenta, aparece «Cargando la flota…». | U-13 |
| HU-1.2-CA11 | Navegador | Con la petición de naves bloqueada, aparece el aviso de error y ninguna nave. | U-14 |
| HU-1.2-CA12 | Navegador | A 1280 px y a 390 px se ven todas las naves sin scroll horizontal. | U-15, U-16 |
| D-01 | Comando | `grep -rnE "#[0-9a-fA-F]{3,8}\b" src --include=*.css --include=*.tsx` solo lista `tokens.css`. | U-01 |
| D-02 | Comando | `grep -rn "style={" src` solo lista el ancho de la barra de combustible. | U-02 |
| D-03 | Navegador | Igual que HU-1.2-CA3, en la esquina superior derecha de la tarjeta. | U-07 |
| D-04 | Navegador | Igual que HU-1.2-CA4. | U-08 |
| D-05 | Navegador, con una nave al 10 % y otra al 25 % | La barra marca el umbral y solo la del 10 % se pinta como baja. | U-09 |
| D-06 | Navegador y revisión de código | «n de 3» y tantas marcas como el máximo del dominio. | U-10 |
| D-07 | Navegador, solo con teclado | Con Tab, todo control muestra el foco en cian, en el orden en que se lee. | U-17 |
| D-08 | Navegador e inspector | Un campo con error tiene borde rojo, mensaje debajo y `aria-invalid="true"`. | U-18 |
| D-09 | Navegador, con el modo responsive | Dos columnas a 1280 px; una a 390 px, sin scroll horizontal. | U-15, U-16 |
| D-10 | Navegador | Los textos coinciden con los de `docs/VERIFICACION.md`. | U-19 |
| I-01 | Revisión de código | `grep -n "aria-describedby" src/components/Formulario*.tsx`: uno por campo, apuntando al id de su mensaje. | U-03 |
| I-02 | Comando | `npm test`, `npm run build` y `git diff --stat -- src/services src/lib supabase` sin cambios. | U-04 |

### Resultados
Los resultados de la prueba están en [docs/VERIFICACION-UI.md](../VERIFICACION-UI.md), y su evaluación, en [docs/AUDITORIA.md](../AUDITORIA.md).

## 5. Tickets

### T-08 · Tokens, base y fuentes
- **Tipo:** Configuración.
- **Descripción:** crear `tokens.css` y `base.css`, cargar IBM Plex en `index.html` e importar las hojas desde `main.tsx`.
- **Definition of Done:**
  - `tokens.css` define todos los tokens de `DESIGN.md` §4.
  - Ningún archivo fuera de `tokens.css` contiene un color hexadecimal (D-01).
  - `index.html` carga las tres variantes de IBM Plex con `display=swap` y mantiene `lang="es"`.
  - `base.css` desactiva las transiciones con `prefers-reduced-motion: reduce`.
  - `main.tsx` importa `tokens.css`, `base.css` y `componentes.css`, en ese orden.
  - `npm test` y `npm run build` pasan.
- **Dependencias:** esta spec y `DESIGN.md`.

### T-09 · Tarjeta de nave
- **Tipo:** Interfaz.
- **Descripción:** crear `componentes.css`, «Tarjeta de nave», «Insignia de estado», «Barra de combustible» y «Contador de misiones»; mostrar la flota como lista de tarjetas con sus «Estados de la flota».
- **Definition of Done:**
  - La flota es un `ul` con un `li` por nave, y cada tarjeta sigue el orden de `DESIGN.md` §6.7.
  - La barra y el contador importan `COMBUSTIBLE_MINIMO` y `MAX_MISIONES_SIN_REVISION`; no hay un 25 ni un 3 escritos a mano.
  - La barra expone `role="meter"` con sus valores y su etiqueta.
  - Se cumplen HU-1.2-CA1 a CA7, CA9 a CA11 y D-03 a D-06.
  - `npm test` y `npm run build` pasan.
- **Dependencias:** T-08 y T-03.

### T-10 · Formularios y avisos
- **Tipo:** Interfaz.
- **Descripción:** aplicar «Campo de formulario», «Botón» y «Avisos» a los dos formularios, sin cambiar sus textos ni su comportamiento.
- **Definition of Done:**
  - Cada campo tiene su etiqueta asociada con `for` / `id`, y cada error se enlaza con `aria-describedby` (I-01).
  - El aviso de éxito usa `role="status"` y el de error, `role="alert"`.
  - Se cumplen D-07, D-08 y D-10.
  - `npm test` y `npm run build` pasan.
- **Dependencias:** T-08, T-09 (comparten `componentes.css`), T-03 y T-06.

### T-11 · Layout del tablero
- **Tipo:** Interfaz.
- **Descripción:** montar en `App.tsx` el encabezado, el «Tablero» y los «Panel», con dos columnas desde el corte de `DESIGN.md` §5 y una por debajo.
- **Definition of Done:**
  - El encabezado muestra «Hangar Orbital» y, debajo, «Control de despegues».
  - «Registrar nave» y «Asignar misión» están en un panel con su `h2`, y «Flota» tiene su propia sección.
  - Se cumplen HU-1.2-CA12 y D-09.
  - `npm test` y `npm run build` pasan.
- **Dependencias:** T-09 y T-10.

## 6. Tickets y archivos
Los tres últimos tickets añaden secciones a `componentes.css`, así que se hacen en orden: T-09, T-10 y T-11. Ningún ticket toca `src/dominio/`, `src/services/`, `src/lib/` ni `supabase/`.

| Ticket | Crea | Modifica |
|---|---|---|
| T-08 · Tokens, base y fuentes | `src/styles/tokens.css`, `src/styles/base.css` | `index.html`, `src/main.tsx` (importa tokens y base) |
| T-09 · Tarjeta de nave | `src/styles/componentes.css`, `src/components/TarjetaNave.tsx`, `src/components/BarraCombustible.tsx`, `src/components/ContadorMisiones.tsx` | `src/components/ListaNaves.tsx`, `src/main.tsx` (importa `componentes.css`) |
| T-10 · Formularios y avisos | — | `src/components/FormularioNave.tsx`, `src/components/FormularioMision.tsx`, `src/styles/componentes.css` (campo, botón y avisos) |
| T-11 · Layout del tablero | — | `src/App.tsx`, `src/styles/componentes.css` (layout y panel) |
