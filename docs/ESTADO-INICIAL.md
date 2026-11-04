Informe de solo lectura: no modifiqué nada. Leí todo lo pedido y el código de `src/`. Corrí `npm test` y `npm run build` (ambos pasan) y miré el historial de git. No abrí la app en el navegador, no leí `.env`, y no re-verifiqué los contrastes de color ni las coincidencias de claves que declara la auditoría.

Una corrección a la premisa: el repo sí trae historial. Hay al menos 8 commits (`edac983` a `730b3af`).

## 1. Qué hace la app y con qué stack
- **Propósito:** registra las naves de un hangar y les asigna misiones. Bloquea la asignación si la nave no es apta.
- **Stack:** Vite 8, React 19, TypeScript 7 en modo strict, `@supabase/supabase-js`, Vitest y Prettier. Los estilos no tienen stack, porque no existen.
- **Pantalla única** ([App.tsx](src/App.tsx)) con tres secciones: registrar nave, asignar misión y flota.
- **Arquitectura:**
  - `src/dominio/` tiene funciones puras: `validarNave`, `validarMision` y `puedeRecibirMision`.
  - `src/services/` es lo único que habla con Supabase.
  - `src/components/` tiene tres componentes que usan los servicios.
- **Base de datos:** dos tablas, `naves` y `misiones`. RLS permite solo `select` e `insert` al rol `anon`. No hay `update` ni `delete`.
- **Contador de misiones:** no se guarda. Se calcula como las misiones con `created_at` posterior a `ultima_revision`.
- **Aptitud de una nave:**
  - Combustible de 25 % o más.
  - Como máximo 3 misiones desde la revisión.
  - Que no esté en reparación.
- **Estado hoy:**
  - Compila y los 44 tests de dominio pasan.
  - Se ve sin estilos: no hay `.css`, `className` ni `style`.
  - Está implementado solo lo que cubren HU-1.1 y HU-1.3.

## 2. El harness

| Elemento | Qué trae |
|---|---|
| `AGENTS.md` (vía `CLAUDE.md`, que solo lo importa) | Stack, estructura, comandos, convenciones (español, camelCase, sin `any`, los componentes no llaman a Supabase). Reglas: no leer ni modificar `.env`, sin claves en el código, solo la clave pública en el frontend, spec obligatoria antes de implementar, y `npm test` y `npm run build` antes de dar por terminada una tarea. |
| `.claude/settings.json` | Un solo hook y ningún bloque `permissions`. |
| Hook `PostToolUse` (`Edit\|Write`) → [formatear.cjs](../.claude/hooks/formatear.cjs) | Lee el JSON que le pasa Claude Code y toma `tool_input.file_path`. Si la extensión es `.ts`, `.tsx`, `.js`, `.json` o `.css`, formatea el archivo con el Prettier del proyecto y respeta `.prettierrc` (comillas simples, 100 columnas). Ante cualquier error sale con código 0 sin avisar. No ejecuta tests ni build. |
| Skill `commit` | Se invoca solo a mano (`disable-model-invocation: true`). Lee `git diff --staged` y se detiene si no hay nada en staging. Nunca hace `git add` ni `git push`. Se detiene si ve `.env` o algo que parezca una clave. Exige Conventional Commits en español, con tipo de la lista `feat`, `fix`, `docs`, `test`, `refactor` o `chore`, y 72 caracteres como máximo. |
| `.claude/skills/design/` | Contiene `DESIGN.md` (sistema «Consola de Hangar» v1.0) y `brand-board.html`. **No tiene `SKILL.md`**, así que no es una skill registrada. Está sin trackear (`??` en git). |

## 3. Estado del sprint (spec 01: HU-1.1 y HU-1.3)

| Ticket | Estado |
|---|---|
| T-01 Preparar el proyecto | Hecho |
| T-02 Reglas de la nave y aptitud | Hecho |
| T-05 Reglas de la misión | Hecho |
| T-03 Guardar y mostrar naves | Pendiente: faltan 2 puntos de su definition of done, que son verificar en navegador |
| T-06 Guardar la misión | Pendiente: faltan 3 puntos de su definition of done, que son verificar en navegador |
| T-04 Verificar HU-1.1 | Pendiente |
| T-07 Verificar HU-1.3 | Pendiente |

- **Criterios:** de 22 cumplen 16 (todos por test) y quedan 6 sin verificar.
  - HU-1.1: CA1, CA2 y CA9.
  - HU-1.3: CA1, CA2 y CA7.
- **Verificación manual:** las 21 filas de [VERIFICACION.md](VERIFICACION.md) tienen vacía la columna de resultado.
- **Historias del backlog:** HU-1.2, HU-1.4 y HU-1.5 están "por refinar". HU-1.6 a HU-1.9 están fuera de alcance o pendientes de decisión.
- **Épica E2** (combustible, revisiones y dique seco): no tiene spec ni código.

## 4. Inconsistencias

**Entre documentos**
1. **`DESIGN.md` dice que `AGENTS.md` lo referencia, pero no lo hace.** Además `AGENTS.md` no menciona `src/styles/`, y el pie del brand board lo ubica "en la raíz del repositorio" cuando está en `.claude/skills/design/`.
2. **Tailwind.** El `CLAUDE.md` global de Milo exige Tailwind; `DESIGN.md` lo prohíbe. `AGENTS.md` no dice nada.
3. **Pantalla móvil.** El PRD supone navegador de escritorio y declara "app móvil" como no-alcance. `DESIGN.md` exige una columna a 390 px (D-09).
4. **Contador "n de 3".** `DESIGN.md` (D-06 y 6.6) muestra "n de 3" con 3 marcas, pero la regla actual acepta una cuarta misión, así que el valor puede ser "4 de 3". La auditoría (observación 2) pide confirmar esa regla al cliente.
5. **Evidencia de T-04.** Su definition of done pide comprobar en pantalla los criterios 1, 3 y 4. La spec §7 y la auditoría dan CA3 y CA4 por cumplidos solo con test (V-07 y V-08 siguen vacíos).
6. **Misión "pendiente".** El criterio 1 de HU-1.3 y la definition of done de T-06 hablan de que aparezca como pendiente. La app solo muestra el mensaje de confirmación y suma al contador; no hay lista de misiones (eso es HU-1.4) ni estado de misión.
7. **Variables de entorno.** La spec, [VERIFICACION.md](VERIFICACION.md) y [supabase.ts:9](../src/lib/supabase.ts#L9) hablan de `.env.local`, y `.env.local` no existe. Las credenciales están en `.env`.
8. **Detalles de `DESIGN.md` frente al brand board:**
   - El estado vacío usa borde punteado `--color-borde` en 6.9, pero el board usa `--color-borde-control`.
   - El board usa muchos estilos en línea y la marca de umbral fija en 25 %. Eso contradice D-02 y la regla de importar el umbral del dominio, aunque es un tablero de referencia.

**Entre documentos y código**
1. `DESIGN.md` exige `src/styles/tokens.css` y `base.css`, la carga de Google Fonts en `index.html`, `aria-invalid`, `aria-describedby`, `role="meter"` y una lista `ul` de tarjetas. Nada de eso existe todavía; hoy la flota es una `table`.
2. `DESIGN.md` afirma que "si la regla cambia, la interfaz cambia sola", pero `MENSAJES_MOTIVO` en [aptitud.ts:7-11](../src/dominio/aptitud.ts#L7-L11) escribe "25 %" y "3 misiones" como texto literal, no desde las constantes.
3. `misionesService` importa `aNave`, `COLUMNAS_NAVE` y `FilaNave` de `navesService`. La spec no prevé esa dependencia entre servicios.
4. `AGENTS.md` lista tres carpetas de documentación, pero `AUDITORIA.md` y `VERIFICACION.md` están en la raíz de `docs/`. `AGENTS.md` tampoco menciona `npm run format`.

## 5. Riesgos abiertos
1. **El bloqueo de naves no aptas solo existe en el frontend.**
   - Con la clave pública, cualquiera puede insertar una misión a una nave no apta. Es el riesgo R-01 de la auditoría.
   - `misionesService.crear` hace "leer, comprobar, insertar" sin atomicidad: dos jefes a la vez pueden pasarse del límite.
   - Ambos casos ponen en riesgo la métrica del PRD ("cero misiones a naves no aptas").
2. **El MVP está incompleto frente al PRD.** Faltan completar misiones (R4), revisiones (R5), dique seco (R6 y R7), corregir combustible y ver las misiones de una nave. Sin revisión, una nave con 4 misiones queda bloqueada, salvo que se edite la base a mano.
3. **Sin evidencia en navegador.** 6 criterios y 4 tickets dependen de una prueba manual que nadie ha anotado.
4. **Decisiones del cliente abiertas:**
   - Si una nave puede llegar a 4 misiones sin revisión.
   - Si "Aurora" y "aurora" son el mismo nombre.
   - Si las fechas de dos misiones pueden solaparse.
   - Qué reloj define "hoy".
   - Misión repetida y fecha de despegue lejana.
   - Qué pasa con las misiones pendientes al entrar en dique seco o al dejar de ser apta. R6 dice que se pierden, pero la spec no tiene estado de misión ni borrado.
5. **El contador depende de comparar `created_at` con `ultima_revision`.** Es frágil ante revisiones y misiones casi simultáneas.
6. **Sin estilos.** El sistema de diseño está sin trackear, no es una skill invocable y no hay spec de interfaz. `AGENTS.md` exige spec antes de implementar cualquier funcionalidad.
7. **Los tests cubren solo el dominio.** Servicios y componentes no tienen tests, incluida `misionesService.crear`. El reparto por archivo (17, 12 y 15 tests) lo tomé de la auditoría; solo confirmé el total de 44.
8. **Las reglas de seguridad son solo texto.** `settings.json` no tiene `permissions` que impidan leer `.env`. El hook ante un error de Prettier lo traga sin aviso, y nada impone `npm test` ni `npm run build` antes de terminar.
9. **Cambios sin commitear.** `package-lock.json` (solo añade `"name"`) y `.claude/skills/design/` están sin commitear.
10. **Documentación mínima.** No hay README, que el `CLAUDE.md` global exige. El bundle contiene la URL y la clave pública de Supabase, algo esperado en un frontend; la protección real depende de RLS.
