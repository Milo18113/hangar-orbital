# Hangar Orbital

## Proyecto
App web para registrar las naves de un hangar, asignarles misiones y saber cuáles pueden despegar.

## Stack
- Vite + React + TypeScript
- Supabase (`@supabase/supabase-js`)
- Tests con Vitest; formato con Prettier

## Estructura prevista
- `src/lib/supabase.ts`: cliente de Supabase
- `src/types/`: tipos del dominio
- `src/dominio/`: funciones puras y sus tests
- `src/services/`: acceso a Supabase
- `src/components/`: componentes de React
- `supabase/migraciones/`: migraciones SQL
- `docs/prd/`, `docs/backlog/`, `docs/specs/`: documentación
- `src/styles/`: estilos y tokens
- `docs/design/`: material de diseño

## Comandos
- `npm run dev`: servidor de desarrollo
- `npm test`: tests con Vitest
- `npm run build`: compilación de producción

## Convenciones
- Nombres del dominio en español.
- camelCase en TypeScript; snake_case en la base de datos.
- Nunca usar `any`.
- Los componentes no llaman a Supabase; solo lo hacen los servicios de `src/services/`.

## Reglas
- Nunca leer ni modificar `.env` ni `.env.local`.
- Nunca escribir claves en el código.
- En el frontend solo va la clave pública (anon o publishable), nunca la `service_role`.
- Ninguna funcionalidad se implementa sin una spec en `docs/specs/`.
- Para cualquier tarea visual, lee `DESIGN.md` antes de escribir código: ahí están los tokens, los componentes y las reglas de estilo.
- Ejecutar `npm test` y `npm run build` antes de dar una tarea por terminada.
