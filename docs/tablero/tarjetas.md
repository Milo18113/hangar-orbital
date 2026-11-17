# Tarjetas del tablero de Hangar Orbital

Este archivo es la fuente que lee la skill `/tablero` para crear o actualizar el tablero **Hangar Orbital** en Trello.

**Formato:** cada tarjeta empieza con una línea que comienza con `## ` (dos almohadillas y un espacio), que es su título. La línea siguiente dice `Lista: <nombre>`. Todo lo que sigue, hasta el próximo `## `, es la descripción de la tarjeta. Dentro de una descripción, los encabezados usan `###` o más, nunca `##`.

En «Por hacer», el orden del archivo es la prioridad: la primera tarjeta se implementa primero.

## Spec 04 · Ver las misiones de una nave
Lista: Por hacer

**Historia:** HU-1.4 · Como jefe de hangar, quiero ver las misiones de cada nave, para saber qué tiene asignado antes de darle otra misión.
**Épica:** E1 · Flota y misiones. **Tickets:** T-15 a T-17.

### 0. Decisiones de esta spec
1. **Se muestran todas las misiones de la nave.** No existe estado de misión (Spec 01, decisión 2), así que «pendiente» equivale a «asignada» hasta que exista HU-1.5. `[SUPUESTO]`
2. **Orden:** por fecha de despegue, de la más próxima a la más lejana. Si dos misiones despegan el mismo día, va primero la que se asignó antes (`createdAt`).
3. **Carga bajo demanda:** las misiones de una nave se cargan al pulsar «Ver misiones», no al abrir la flota.
4. **Solo lectura:** esta spec no cambia el contador, la aptitud ni la base de datos. No necesita migración: la política de lectura de `misiones` ya existe.

### 1. Funciones puras (`src/dominio/mision.ts`)
- `ordenarMisiones(misiones: Mision[]): Mision[]`: devuelve un arreglo nuevo ordenado según la decisión 2. NO DEBE modificar el arreglo recibido.
- `describirFechaDespegue(fecha: string, hoy: string): string`: ambas en `YYYY-MM-DD`. Devuelve «Hoy» si coinciden, «Mañana» si `fecha` es el día siguiente a `hoy`, «Despegó el DD/MM/AAAA» si `fecha` es anterior a `hoy`, y «DD/MM/AAAA» en cualquier otro caso.
- `describirDuracion(dias: number): string`: «1 día» para 1 y «N días» para cualquier otro entero.

### 2. Servicio (`src/services/misionesService.ts`)
- `listarPorNave(naveId: string): Promise<Mision[]>`: lee las misiones de la nave con las columnas de `COLUMNAS_MISION` y las devuelve con `aMision`, sin ordenar. Si Supabase devuelve un error, lanza un `Error` con su mensaje.

### 3. Componente (`src/components/MisionesNave.tsx`)
- Se muestra como **último bloque** de la Tarjeta de nave, después de los motivos. Antes de escribir código, se añade este bloque 7 a la sección 6.7 de `DESIGN.md`.
- Un Botón secundario (DESIGN.md §6.3) con el texto «Ver misiones», que cambia a «Ocultar misiones» cuando la lista está abierta.
- Al abrir: «Cargando misiones…» mientras carga; «No se pudieron cargar las misiones.» como aviso de error (DESIGN.md §6.8) si falla; «Esta nave no tiene misiones.» si no hay ninguna.
- Cada misión es un `li` con el destino, la fecha de `describirFechaDespegue` en `--fuente-cifras` y la duración de `describirDuracion`.
- Solo usa tokens de `DESIGN.md`. La fecha de hoy se obtiene con `fechaLocalHoy()` de `src/lib/fecha.ts`.

### 4. Criterios de aceptación
- **HU-1.4-CA1:** con una nave que tiene dos misiones con despegue el 20/12/2026 y el 10/12/2026, al pulsar «Ver misiones» la app DEBE listar las dos, primero la del 10/12/2026.
- **HU-1.4-CA2:** con dos misiones que despegan el mismo día, la app DEBE mostrar primero la que se asignó antes.
- **HU-1.4-CA3:** con una nave sin misiones, la app DEBE mostrar «Esta nave no tiene misiones.».
- **HU-1.4-CA4:** una misión que despega hoy DEBE mostrar «Hoy», y una que despega mañana, «Mañana».
- **HU-1.4-CA5:** una misión con fecha de despegue anterior a hoy DEBE mostrar «Despegó el DD/MM/AAAA».
- **HU-1.4-CA6:** una misión de 1 día DEBE mostrar «1 día», y una de 5 días, «5 días».
- **HU-1.4-CA7:** si falla la carga, la app DEBE mostrar «No se pudieron cargar las misiones.», y el resto de la tarjeta DEBE seguir visible.
- **HU-1.4-CA8:** ver las misiones NO DEBE cambiar el contador ni la aptitud de la nave.

### 5. Verificación
| Criterio | Cómo |
| --- | --- |
| CA1, CA2 | Vitest: `ordenarMisiones` (incluye que no modifica el arreglo original) |
| CA4, CA5 | Vitest: `describirFechaDespegue` (hoy, mañana, ayer, fecha futura, cambio de mes y de año) |
| CA6 | Vitest: `describirDuracion` |
| CA3, CA7, CA8 | Manual en el navegador |

### 6. Tickets y archivos
| Ticket | Crea | Modifica |
| --- | --- | --- |
| T-15 · Reglas de presentación de misiones | — | `src/dominio/mision.ts`, `src/dominio/mision.test.ts` |
| T-16 · Listar y mostrar las misiones | `src/components/MisionesNave.tsx`, `src/styles/misiones.css` | `src/services/misionesService.ts`, `src/components/TarjetaNave.tsx`, `DESIGN.md` (§6.7, bloque 7) |
| T-17 · Verificar HU-1.4 | — | Esta spec (resultados de la prueba manual) |

### Pendientes
(La implementación anota aquí lo que encuentre fuera de alcance.)

## Spec 05 · Registrar una revisión
Lista: Por hacer

**Historia:** HU-2.1 · Como jefe de hangar, quiero registrar que una nave pasó revisión, para que pueda volver a recibir misiones.
**Épica:** E2 · Mantenimiento. **Regla:** R5 (una revisión pone el contador de misiones a cero). **Tickets:** T-18 y T-19.

### 0. Decisiones de esta spec
1. **Registrar una revisión actualiza `ultima_revision` a la fecha y hora actuales.** El contador cuenta las misiones creadas después de esa fecha (Spec 01, decisión 1), así que vuelve a 0 sin guardar ningún contador.
2. **Una nave en reparación no puede registrar revisión:** salir del dique seco ya cuenta como revisión (R7), que se implementará en otra spec.
3. **La fecha la pone la base de datos** con `now()`, no el navegador, para que no dependa del reloj del jefe.

### 1. Base de datos
Archivo nuevo: `supabase/migraciones/002_registrar_revision.sql`.
- Una función `registrar_revision(p_nave_id uuid)` con `security invoker` que actualiza `ultima_revision = now()` solo si la nave existe y `en_reparacion` es falso, y devuelve la fila actualizada.
- Permiso para `anon`: `update` únicamente sobre la columna `ultima_revision` de `naves`, con su política RLS de actualización. Ninguna otra columna se puede actualizar.

### 2. Funciones puras (`src/dominio/revision.ts`)
- `puedeRegistrarRevision(nave: Pick<Nave, 'enReparacion'>): { puede: true } | { puede: false; motivo: string }`. Si la nave está en reparación, el motivo es «La nave está en reparación: la revisión se registra al salir del dique seco.».

### 3. Servicio (`src/services/navesService.ts`)
- `registrarRevision(naveId: string): Promise<Nave>`: llama a la función `registrar_revision` con `rpc` y devuelve la nave con `aNave`. Lanza un `Error` si Supabase falla o si no devuelve ninguna fila.

### 4. Componente
- En la Tarjeta de nave, un Botón secundario «Registrar revisión». Si `puedeRegistrarRevision` dice que no, el botón aparece deshabilitado y el motivo se muestra debajo.
- Al terminar: aviso de éxito «Revisión registrada.» y la tarjeta se actualiza (contador y aptitud). Si falla: aviso de error «No se pudo registrar la revisión.».

### 5. Criterios de aceptación
- **HU-2.1-CA1:** con una nave al 60 % y 3 misiones desde la última revisión, al registrar una revisión la nave DEBE pasar a «0 de 3» y a «Apta».
- **HU-2.1-CA2:** con una nave al 10 % y 3 misiones, al registrar una revisión DEBE pasar a «0 de 3» y DEBE seguir «No apta» por combustible insuficiente.
- **HU-2.1-CA3:** con una nave en reparación, el botón DEBE estar deshabilitado y DEBE mostrarse el motivo.
- **HU-2.1-CA4:** después de registrar la revisión, la app DEBE mostrar «Revisión registrada.».
- **HU-2.1-CA5:** una misión asignada después de la revisión DEBE contar como «1 de 3».

### 6. Tickets y archivos
| Ticket | Crea | Modifica |
| --- | --- | --- |
| T-18 · Regla y servicio de revisión | `supabase/migraciones/002_registrar_revision.sql`, `src/dominio/revision.ts`, `src/dominio/revision.test.ts` | `src/services/navesService.ts` |
| T-19 · Botón y verificación | — | `src/components/TarjetaNave.tsx`, `src/components/ListaNaves.tsx`, esta spec (resultados) |

### Pendientes
(La implementación anota aquí lo que encuentre fuera de alcance.)

## Spec 06 · Corregir el combustible
Lista: Por hacer

**Historia:** HU-2.2 · Como jefe de hangar, quiero corregir el combustible de una nave, para que su aptitud refleje el nivel real.
**Épica:** E2 · Mantenimiento. **Regla:** R4 (el combustible se puede corregir en cualquier momento). **Tickets:** T-20 y T-21.

### 0. Decisiones de esta spec
1. **Mismas reglas que al registrar:** entero entre 0 y 100, con los mismos mensajes de `validarNave` (HU-1.1-CA7 y CA8).
2. **Un texto con solo espacios cuenta como vacío.**
3. **Se puede corregir aunque la nave esté en reparación.** R4 dice «en cualquier momento».

### 1. Base de datos
Archivo nuevo: `supabase/migraciones/003_corregir_combustible.sql`. Permiso para `anon`: `update` únicamente sobre la columna `combustible` de `naves`, con su política RLS. El `check` de la columna (0 a 100) ya existe.

### 2. Funciones puras (`src/dominio/nave.ts`)
- `validarCombustible(texto: string): { ok: true; valor: number } | { ok: false; error: string }`. Vacío o solo espacios: «Indica el combustible de la nave.». No numérico, decimal, negativo o mayor que 100: «El combustible debe ser un número entero entre 0 y 100.». `validarNave` pasa a usar los mismos textos, sin duplicarlos.

### 3. Servicio (`src/services/navesService.ts`)
- `corregirCombustible(naveId: string, combustible: number): Promise<Nave>`: actualiza solo `combustible` y devuelve la nave con `aNave`.

### 4. Componente
- En la Tarjeta de nave, un Campo de formulario «Corregir combustible» con un Botón secundario «Guardar». Los errores se muestran bajo el campo (DESIGN.md §6.2). Al guardar, la barra de combustible y la aptitud se actualizan.

### 5. Criterios de aceptación
- **HU-2.2-CA1:** al corregir de 24 % a 25 % una nave operativa con menos de 3 misiones, DEBE pasar de «No apta» a «Apta».
- **HU-2.2-CA2:** al corregir de 60 % a 10 %, DEBE pasar a «No apta» por combustible insuficiente.
- **HU-2.2-CA3:** con el campo vacío o con solo espacios, la app NO DEBE guardar y DEBE mostrar «Indica el combustible de la nave.».
- **HU-2.2-CA4:** con -1, 101, 24,5 o «abc», la app NO DEBE guardar y DEBE mostrar el mensaje de rango.
- **HU-2.2-CA5:** con 0 y con 100, la app DEBE guardar.
- **HU-2.2-CA6:** una nave en reparación DEBE poder corregir su combustible.

### 6. Tickets y archivos
| Ticket | Crea | Modifica |
| --- | --- | --- |
| T-20 · Regla y servicio de combustible | `supabase/migraciones/003_corregir_combustible.sql` | `src/dominio/nave.ts`, `src/dominio/nave.test.ts`, `src/services/navesService.ts` |
| T-21 · Campo y verificación | — | `src/components/TarjetaNave.tsx`, `src/components/ListaNaves.tsx`, esta spec (resultados) |

### Pendientes
(La implementación anota aquí lo que encuentre fuera de alcance.)

## HU-1.5 · Completar una misión
Lista: Backlog

Como jefe de hangar, quiero marcar una misión como completada y anotar el combustible que le queda a la nave, para dejar constancia de que volvió.

- **Reglas:** R3 (completar no cambia el contador) y R4 (el combustible es obligatorio al completar).
- **Falta antes de la spec:** decidir con el cliente cómo se guarda el estado de una misión (hoy no existe) y si una misión completada sigue apareciendo en «Ver misiones».

## HU-2.3 · Poner una nave en dique seco y sacarla
Lista: Backlog

Como jefe de hangar, quiero poner una nave en dique seco y sacarla de él, para que no reciba misiones mientras se repara.

- **Reglas:** R6 (al entrar pierde sus misiones pendientes y no recibe nuevas) y R7 (salir cuenta como revisión).
- **Falta antes de la spec:** qué significa «pierde sus misiones pendientes» si las misiones no tienen estado.

## Decisión · ¿«4 de 3» es posible?
Lista: Backlog

La Spec 02 dejó como `[SUPUESTO]` que el contador puede mostrar más misiones que el máximo, por ejemplo «4 de 3», si llegan datos antiguos. Hay que confirmarlo con el cliente antes de cerrar E1.

## HU-1.9 · Consultar el historial de misiones
Lista: Backlog

Como jefe de hangar, quiero ver las misiones completadas de una nave, para revisar su actividad pasada.

- **Falta antes de la spec:** el PRD tiene abierto si se conserva el historial. Depende de HU-1.5.
