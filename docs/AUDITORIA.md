# Auditoría · Spec 01 (flota y misiones)

- **Fecha:** 2026-10-28.
- **Alcance:** [docs/specs/01-flota-y-misiones.md](specs/01-flota-y-misiones.md), historias HU-1.1 y HU-1.3, tickets T-01 a T-07.
- **Commit auditado:** `39d0df9`.

## Resumen
- **`npm test`:** 3 archivos y 44 tests, todos en verde.
- **`npm run build`:** compila sin errores. El bundle (`dist/assets/index-*.js`, 444 kB) contiene la app completa.
- **Criterios:** 22 en total.
  - **Cumplen:** 16.
  - **No cumplen:** 0.
  - **Sin verificar:** 6.
- **Por qué quedan 6 sin verificar:** [docs/VERIFICACION.md](VERIFICACION.md) tiene vacía la columna "Resultado obtenido" en sus 21 filas, y git no registra cambios en ese archivo. Los criterios que la spec manda comprobar en el navegador no tienen evidencia, así que se marcan "sin verificar", no "cumple".

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
| HU-1.3-CA2 | Navegador (V-17) | Sin verificar | V-17 sin resultado anotado. |
| HU-1.3-CA3 | Test | Cumple | `aptitud.test.ts` › acepta una nave con exactamente 3 misiones desde la última revisión. |
| HU-1.3-CA4 | Test | Cumple | `aptitud.test.ts` › rechaza una nave con 4 misiones desde la última revisión. |
| HU-1.3-CA5 | Test | Cumple | `aptitud.test.ts` › rechaza una nave con un 24 % de combustible. |
| HU-1.3-CA6 | Test | Cumple | `aptitud.test.ts` › acepta una nave con exactamente un 25 % de combustible. |
| HU-1.3-CA7 | Test + navegador (V-21) | Sin verificar | El test pasa: `aptitud.test.ts` › rechaza una nave en reparación aunque tenga combustible y pocas misiones. Falta V-21. |
| HU-1.3-CA8 | Test | Cumple | `aptitud.test.ts` › devuelve los dos motivos con poco combustible y 4 misiones. |
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
| Formato con Prettier | Cumple | `prettier --check src` no encuentra nada que formatear. |

## Observaciones
1. **Verificación en el navegador sin anotar.** Para cerrar los 6 criterios pendientes, hay que anotar los resultados en `docs/VERIFICACION.md` y repetir esta auditoría.
2. **La cuarta misión se acepta.** Con la regla R1 actual ("3 misiones asignadas o menos"), una nave con 3 misiones recibe una cuarta, y es la quinta la que se rechaza. El código cumple la spec, pero falta que el cliente confirme si una nave puede llegar a 4 misiones sin revisión.
3. **El bundle contiene la URL y la clave pública.** Es lo esperado en una app de frontend: esa clave es pública por diseño. La protección real depende de las políticas RLS (ver Riesgos).

## Riesgos conocidos

| # | Riesgo | Impacto | Estado |
|---|---|---|---|
| R-01 | Las políticas RLS permiten leer e insertar a cualquiera que tenga la clave pública, porque el MVP no tiene usuarios. | Cualquiera con la clave puede ver la flota y crear naves o misiones sin pasar por la app. En particular, puede asignar una misión a una nave no apta, porque el bloqueo de la regla R2 solo se aplica en el frontend. Eso pone en riesgo la métrica de éxito ("cero misiones asignadas a naves no aptas"). | Aceptado de forma temporal. Se resuelve cuando haya inicio de sesión (políticas para `authenticated`) y validando la aptitud en la base de datos. |
