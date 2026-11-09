# Auditoría · Spec 01 (flota y misiones)

- **Fecha:** 2026-10-28. Actualizada el 2026-11-09 tras la corrección del límite de misiones.
- **Alcance:** [docs/specs/01-flota-y-misiones.md](specs/01-flota-y-misiones.md), historias HU-1.1 y HU-1.3, tickets T-01 a T-07.
- **Commit auditado:** `39d0df9`. La actualización del 2026-11-09 se hizo sobre el árbol de trabajo, que parte de `f6d6f62` e incluye la corrección del límite.

## Resumen
- **`npm test`:** 3 archivos y 44 tests, todos en verde (`nave.test.ts`: 18, `aptitud.test.ts`: 11, `mision.test.ts`: 15).
- **`npm run build`:** compila sin errores. El bundle (`dist/assets/index-*.js`, 447 kB) contiene la app completa.
- **Criterios:** 22 en total.
  - **Cumplen:** 16.
  - **No cumplen:** 0.
  - **Sin verificar:** 6.
- **Por qué quedan 6 sin verificar:** [docs/VERIFICACION.md](VERIFICACION.md) tiene vacía la columna "Resultado obtenido" en 20 de sus 21 filas (V-19 se retiró con la corrección del límite). El archivo cambió, pero solo en los resultados esperados, no en los obtenidos. Los criterios que la spec manda comprobar en el navegador no tienen evidencia, así que se marcan "sin verificar", no "cumple".

## Criterios de aceptación

| Criterio | Cómo se verificó | Resultado | Evidencia |
|---|---|---|---|
| HU-1.1-CA1 | Navegador (V-03) | Sin verificar | V-03 sin resultado anotado. |
| HU-1.1-CA2 | Test + navegador (V-01) | Sin verificar | El test pasa: `nave.test.ts` › rechaza la clase "crucero" y "Carguera". Falta V-01, el selector en pantalla. |
| HU-1.1-CA3 | Test | Cumple | `aptitud.test.ts` › acepta una nave con exactamente un 25 % de combustible. |
| HU-1.1-CA4 | Test | Cumple | `aptitud.test.ts` › rechaza una nave con un 10 % de combustible. |
| HU-1.1-CA5 | Test | Cumple | `nave.test.ts` › rechaza el nombre "" y "   ". |
| HU-1.1-CA6 | Test | Cumple | `nave.test.ts` › rechaza la clase "". |
| HU-1.1-CA7 | Test | Cumple | `nave.test.ts` › rechaza una nave sin combustible. |
| HU-1.1-CA8 | Test | Cumple | `nave.test.ts` › rechaza el combustible -1, 101, 24.5 y NaN; acepta 0, 25 y 100. |
| HU-1.1-CA9 | Navegador (V-06) | Sin verificar | V-06 sin resultado anotado. En el código, `navesService.crear` traduce el error `23505` al aviso, y la migración declara `nombre ... unique`. |
| HU-1.3-CA1 | Navegador (V-10) | Sin verificar | V-10 sin resultado anotado. |
| HU-1.3-CA2 | Navegador (V-17) | Sin verificar | V-17 sin resultado anotado. El test `aptitud.test.ts` › rechaza una nave con 3 misiones desde la última revisión cubre que, con 3, la nave deja de ser apta; falta ver en pantalla que la asignación sume 1 y muestre 3. Afectado por la corrección del límite. |
| HU-1.3-CA3 | Test | Cumple | `aptitud.test.ts` › acepta una nave con exactamente 2 misiones desde la última revisión. Afectado por la corrección del límite (antes, 3 misiones). |
| HU-1.3-CA4 | Test | Cumple | `aptitud.test.ts` › rechaza una nave con 3 misiones desde la última revisión. Afectado por la corrección del límite (antes, 4 misiones). La fila V-18 comprobará el rechazo en pantalla. |
| HU-1.3-CA5 | Test | Cumple | `aptitud.test.ts` › rechaza una nave con un 24 % de combustible. |
| HU-1.3-CA6 | Test | Cumple | `aptitud.test.ts` › acepta una nave con exactamente un 25 % de combustible. |
| HU-1.3-CA7 | Test + navegador (V-21) | Sin verificar | El test pasa: `aptitud.test.ts` › rechaza una nave en reparación aunque tenga combustible y pocas misiones. Falta V-21. |
| HU-1.3-CA8 | Test | Cumple | `aptitud.test.ts` › devuelve los dos motivos con poco combustible y 3 misiones. Afectado por la corrección del límite (antes, 4 misiones). |
| HU-1.3-CA9 | Test | Cumple | `mision.test.ts` › rechaza una misión sin nave, sin destino, sin fecha o sin duración, y devuelve todos los errores a la vez. |
| HU-1.3-CA10 | Test | Cumple | `mision.test.ts` › acepta una fecha de despegue igual a hoy. |
| HU-1.3-CA11 | Test | Cumple | `mision.test.ts` › rechaza la fecha de despegue 2026-10-27 y 2025-12-31. |
| HU-1.3-CA12 | Test | Cumple | `mision.test.ts` › acepta una duración de 1 día. |
| HU-1.3-CA13 | Test | Cumple | `mision.test.ts` › rechaza una duración de 0, -1, 2.5 y NaN días. |

Los tests verifican las funciones del dominio (`validarNave`, `validarMision` y `puedeRecibirMision`), no la pantalla, tal como fija la tabla de verificación de la spec. Que el formulario muestre cada mensaje solo lo confirma el recorrido en el navegador.

## Otras comprobaciones de la spec

| Punto de la spec | Resultado | Evidencia |
|---|---|---|
| §1 Migración en `supabase/migraciones/001_hangar.sql` | Cumple | El SQL coincide con la spec: dos tablas, índice, RLS y cuatro políticas para `anon`. |
| §2 Tipos `Nave` y `Mision` en camelCase | Cumple | `src/types/nave.ts` y `src/types/mision.ts`. |
| §3 Funciones puras sin reloj ni Supabase | Cumple | `validarMision` recibe `hoy` como parámetro, y `src/dominio/` no importa servicios. |
| §4 Solo los servicios llaman a Supabase | Cumple | Solo `navesService.ts` y `misionesService.ts` importan `lib/supabase`. |
| §4 `misionesService.crear` vuelve a leer la nave antes de decidir | Cumple | Revisión de código: lee la nave y cuenta sus misiones antes de llamar a `puedeRecibirMision`, e inserta solo si puede. |
| AGENTS.md: nunca `any` | Cumple | 0 apariciones en `src/`. |
| AGENTS.md: sin claves en el código | Cumple | 0 coincidencias de JWT, `sk-`, `service_role` o URL de proyecto en `src/`. |
| Formato con Prettier | Cumple | `prettier --check --end-of-line auto src` no encuentra nada que formatear. Sin esa opción avisa de 11 archivos, incluidos algunos sin cambios, por los fines de línea CRLF de Windows (`core.autocrlf=true`), no por el estilo. |

## Observaciones
1. **Verificación en el navegador sin anotar.** Para cerrar los 6 criterios pendientes, hay que anotar los resultados en `docs/VERIFICACION.md` y repetir esta auditoría.
2. **La cuarta misión se acepta. — Resuelta (2026-11-09).** El cliente decidió que una nave admite como máximo 3 misiones entre revisiones, y que con 3 ya no es apta. La corrección bajó por la cadena: R1 en el PRD y en las épicas, los criterios de HU-1.3 en el backlog, la spec 01, los tests, `aptitud.ts` y `docs/VERIFICACION.md`. Ahora `puedeRecibirMision` rechaza con `misionesDesdeRevision >= MAX_MISIONES_SIN_REVISION` (`MAX_MISIONES_SIN_REVISION = 3`), y los tests de CA3, CA4 y CA8 lo cubren. Lo único que falta es verlo en el navegador (V-17 y V-18).
3. **El bundle contiene la URL y la clave pública.** Es lo esperado en una app de frontend: esa clave es pública por diseño. La protección real depende de las políticas RLS (ver Riesgos).
4. **Los resultados de Vitest de la spec 01 están desactualizados.** La sección "Resultados (T-04 y T-07)" de la spec 01 cuenta 17 tests en `nave.test.ts` y 12 en `aptitud.test.ts`. Hoy son 18 y 11; el total sigue siendo 44. Hay que actualizar esas cifras en la spec.

# Auditoría · Spec 02 (interfaz «Consola de Hangar»)

- **Fecha:** 2026-11-09.
- **Alcance:** [docs/specs/02-interfaz-flota.md](specs/02-interfaz-flota.md), historia HU-1.2 y la presentación de los formularios, tickets T-08 a T-11.
- **Estado auditado:** árbol de trabajo, a partir de `f6d6f62`.
- **Resultados de la prueba:** [docs/VERIFICACION-UI.md](VERIFICACION-UI.md). Solo tiene anotadas las filas U-01 y U-02. El resto está sin completar.

## Resumen
- **`npm test`:** 3 archivos y 44 tests, todos en verde.
- **`npm run build`:** `tsc --noEmit` y `vite build` terminan sin errores. El bundle pesa 447 kB de JavaScript y 6 kB de CSS.
- **Criterios:** 24 en total (12 de HU-1.2, 10 de `DESIGN.md` y 2 propios de la spec).
  - **Cumplen:** 4 (D-01, D-02, I-01 e I-02).
  - **No cumplen:** 0.
  - **Sin verificar:** 20.
- **Por qué quedan 20 sin verificar:** las filas U-05 a U-19 de `docs/VERIFICACION-UI.md` tienen vacía la columna "Resultado obtenido". Esos criterios se comprueban en la app real, contra Supabase. La columna "Evidencia" recoge lo que sí se pudo confirmar leyendo el código, pero eso no sustituye la prueba en pantalla.
- **I-01 e I-02:** se comprobaron en esta auditoría con los comandos de las filas U-03 y U-04, pero esas filas siguen sin anotar en `VERIFICACION-UI.md`.
- **Tickets:** T-08 está hecho. T-09, T-10 y T-11 quedan pendientes de la verificación en el navegador (ver el backlog).

## Criterios de aceptación

| Criterio | Cómo se verificó | Resultado | Evidencia |
|---|---|---|---|
| HU-1.2-CA1 | Navegador (U-06) | Sin verificar | U-06 sin resultado anotado. `ListaNaves.tsx` pinta una `TarjetaNave` por cada nave que devuelve `navesService.listar`, con nombre, clase, combustible, misiones y estado. |
| HU-1.2-CA2 | Navegador (U-06) | Sin verificar | U-06 sin resultado anotado. `navesService.listar` ordena con `.order('nombre')`. |
| HU-1.2-CA3 | Navegador (U-07) | Sin verificar | U-07 sin resultado anotado. `TarjetaNave.tsx` pone la insignia «Apta» o «No apta», con texto, en la cabecera. |
| HU-1.2-CA4 | Navegador (U-08) | Sin verificar | U-08 sin resultado anotado. `TarjetaNave.tsx` lista `MENSAJES_MOTIVO[motivo]` solo cuando `aptitud.puede` es falso. |
| HU-1.2-CA5 | Navegador y código (U-09) | Sin verificar | U-09 sin resultado anotado. `BarraCombustible.tsx` importa `COMBUSTIBLE_MINIMO`, compara con `<` (un 25 % exacto no es bajo) y no escribe ningún 25. |
| HU-1.2-CA6 | Navegador y código (U-10) | Sin verificar | U-10 sin resultado anotado. `ContadorMisiones.tsx` importa `MAX_MISIONES_SIN_REVISION` y muestra «n de máximo». Un `grep` de `3` en `BarraCombustible.tsx` y `ContadorMisiones.tsx` no encuentra nada. |
| HU-1.2-CA7 | Navegador (U-11) | Sin verificar | U-11 sin resultado anotado. `TarjetaNave.tsx` muestra la insignia «En reparación» o el texto «Operativa». |
| HU-1.2-CA8 | Navegador (U-12) | Sin verificar | U-12 sin resultado anotado. `App.tsx` incrementa `version` en `recargar`, y `ListaNaves` recarga cuando `version` cambia. |
| HU-1.2-CA9 | Navegador (U-05) | Sin verificar | U-05 sin resultado anotado. El texto está en `ListaNaves.tsx`. |
| HU-1.2-CA10 | Navegador (U-13) | Sin verificar | U-13 sin resultado anotado. El texto está en `ListaNaves.tsx`. |
| HU-1.2-CA11 | Navegador (U-14) | Sin verificar | U-14 sin resultado anotado. `ListaNaves.tsx` devuelve solo el aviso de error cuando falla la carga, antes de pintar ninguna nave. |
| HU-1.2-CA12 | Navegador (U-15 y U-16) | Sin verificar | U-15 y U-16 sin resultado anotado. `componentes.css` fija el corte de dos columnas en 900 px. Falta verlo a 1280 px y a 390 px. |
| D-01 | Comando (U-01) | Cumple | El comando de `DESIGN.md` §9 devuelve 15 líneas, todas de `src/styles/tokens.css`. Anotado en U-01. |
| D-02 | Comando (U-02) | Cumple | Una sola coincidencia: `src/components/BarraCombustible.tsx:25`, el ancho del relleno. Anotado en U-02. |
| D-03 | Navegador (U-07) | Sin verificar | Igual que HU-1.2-CA3. |
| D-04 | Navegador (U-08) | Sin verificar | Igual que HU-1.2-CA4. |
| D-05 | Navegador (U-09) | Sin verificar | Igual que HU-1.2-CA5. |
| D-06 | Navegador y código (U-10) | Sin verificar | Igual que HU-1.2-CA6. |
| D-07 | Navegador (U-17) | Sin verificar | U-17 sin resultado anotado. `componentes.css` define `:focus-visible` con un contorno del color de acento en campos y botones, y no contiene `outline: none`. |
| D-08 | Navegador (U-18) | Sin verificar | U-18 sin resultado anotado. Los dos formularios ponen `aria-invalid` y `aria-describedby` solo cuando el campo tiene error, y `componentes.css` pinta el borde con `[aria-invalid='true']`. |
| D-09 | Navegador (U-15 y U-16) | Sin verificar | Igual que HU-1.2-CA12. |
| D-10 | Navegador (U-19) | Sin verificar | U-19 sin resultado anotado. Los tres textos de la flota están en `ListaNaves.tsx` y «Control de despegues» en `App.tsx`. Falta compararlos en pantalla con `docs/VERIFICACION.md`. |
| I-01 | Revisión de código (U-03) | Cumple | `grep -n "aria-describedby" src/components/Formulario*.tsx`: 3 coincidencias en `FormularioNave.tsx` (líneas 66, 83 y 111) y 4 en `FormularioMision.tsx` (119, 143, 162 y 182). Cada una apunta al id del mensaje de su campo y solo aparece con error. Comprobado en esta auditoría; U-03 sin anotar. |
| I-02 | Comando (U-04) | Cumple | `npm test` (44 en verde) y `npm run build` pasan. `git diff --stat -- src/services src/lib supabase` no muestra nada. En `src/dominio/` solo cambian `aptitud.ts` y `aptitud.test.ts` (10 inserciones y 10 eliminaciones), y el cambio de `aptitud.ts` es el del límite: el mensaje y `>` por `>=`. No son de la interfaz. U-04 sin anotar. |

## Otras comprobaciones de la spec

| Punto | Resultado | Evidencia |
|---|---|---|
| §0.1 Sin Tailwind ni librerías de estilos | Cumple | Buscar `tailwind`, `bootstrap`, `styled`, `emotion`, `mui`, `chakra`, `antd` y `sass` en `package.json` no devuelve nada. |
| `DESIGN.md` §8: sin sombras, gradientes ni animaciones | Cumple | `box-shadow`, `text-shadow`, `gradient`, `@keyframes` y `animation` no aparecen en `src/styles/`. |
| `DESIGN.md` §4.1 a §4.4: tokens | Cumple | Todo token citado en `DESIGN.md` existe en `src/styles/tokens.css`. |
| `DESIGN.md` §4.4: movimiento reducido | Cumple | `base.css` desactiva las transiciones con `prefers-reduced-motion: reduce`. |
| §2 Importación y fuentes | Cumple | `main.tsx` importa `tokens.css`, `base.css` y `componentes.css`, en ese orden. `index.html` carga las tres variantes de IBM Plex con `display=swap` y mantiene `lang="es"`. |
| §6 Ningún ticket toca dominio, servicios ni base de datos | Cumple | Ver I-02. |

## Observaciones
1. **Verificación en el navegador sin completar.** Para cerrar los 20 criterios pendientes, hay que completar U-03 a U-19 en `docs/VERIFICACION-UI.md` y repetir esta auditoría. La prueba necesita las tablas `naves` y `misiones` creadas en Supabase.
2. **Un divisor que `DESIGN.md` no menciona.** `TarjetaNave.tsx` pone un `<hr className="divisor" />` entre el contador y el estado de la nave, y `DESIGN.md` §6.7 no lo incluye en el orden de la tarjeta. No rompe ningún criterio D-01 a D-10. Conviene decidir si se queda, y entonces documentarlo en `DESIGN.md`, o si se quita.

# Riesgos conocidos

| # | Riesgo | Impacto | Estado |
|---|---|---|---|
| R-01 | Las políticas RLS permiten leer e insertar a cualquiera que tenga la clave pública, porque el MVP no tiene usuarios. | Cualquiera con la clave puede ver la flota y crear naves o misiones sin pasar por la app. En particular, puede asignar una misión a una nave no apta, porque el bloqueo de la regla R2 solo se aplica en el frontend. Eso pone en riesgo la métrica de éxito ("cero misiones asignadas a naves no aptas"). | Abierto. Aceptado de forma temporal. Se resuelve cuando haya inicio de sesión (políticas para `authenticated`) y validando la aptitud en la base de datos. |
