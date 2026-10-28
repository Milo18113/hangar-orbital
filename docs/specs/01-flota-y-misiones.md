# Spec 01 · Flota y misiones

- **Historias:** HU-1.1 (registrar una nave) y HU-1.3 (asignar una misión a una nave apta).
- **Origen:** [docs/backlog/E1-flota-y-misiones.md](../backlog/E1-flota-y-misiones.md) y [docs/prd/hangar-mvp.md](../prd/hangar-mvp.md).
- **Tickets:** T-01 a T-07.

## 0. Decisiones de esta spec
1. **El contador cuenta misiones creadas.** "Misiones desde la última revisión" es el número de misiones de la nave con `created_at` posterior a `ultima_revision`. No hay contador guardado ni estado de misión. Así lo decidió el cliente, y la regla R3 del PRD y el backlog ya lo reflejan.
2. **No hay estado de misión.** Una misión creada se considera asignada. Completar misiones (HU-1.5) queda fuera de esta spec.
3. **`puedeRecibirMision` devuelve una lista de motivos, no uno solo.** Así cumple HU-1.3-CA8, que exige mostrar todos los motivos a la vez.
4. **"Hoy" es la fecha local del navegador del jefe**, en formato `YYYY-MM-DD`. Se calcula fuera del dominio y se pasa como parámetro.
5. **Nombre único:** la base de datos compara el nombre tal cual. El formulario recorta los espacios de los extremos antes de guardar. Sigue abierto si "Aurora" y "aurora" cuentan como el mismo nombre.
6. **El combustible es un número entero.** Esto resuelve el caso borde de los decimales: 24,9 % no se acepta.
7. **"Dique seco" y "reparación" son lo mismo.** En el código se llama `en_reparacion` / `enReparacion`.

## 1. Base de datos (Supabase)
Archivo: `supabase/migraciones/001_hangar.sql`.

```sql
-- Naves del hangar
create table naves (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null unique check (char_length(btrim(nombre)) > 0),
  clase           text not null check (clase in ('exploradora', 'carguera', 'transporte')),
  combustible     integer not null check (combustible between 0 and 100),
  en_reparacion   boolean not null default false,
  ultima_revision timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

-- Misiones asignadas a una nave
create table misiones (
  id             uuid primary key default gen_random_uuid(),
  nave_id        uuid not null references naves (id),
  destino        text not null check (char_length(btrim(destino)) > 0),
  fecha_despegue date not null,
  duracion_dias  integer not null check (duracion_dias >= 1),
  created_at     timestamptz not null default now()
);

create index misiones_nave_id_created_at_idx on misiones (nave_id, created_at);

-- RLS
alter table naves enable row level security;
alter table misiones enable row level security;

create policy "anon puede leer naves"
  on naves for select to anon using (true);
create policy "anon puede insertar naves"
  on naves for insert to anon with check (true);

create policy "anon puede leer misiones"
  on misiones for select to anon using (true);
create policy "anon puede insertar misiones"
  on misiones for insert to anon with check (true);
```

- **Por qué estas políticas son temporales:** el MVP no tiene inicio de sesión, así que cualquiera con la clave pública puede leer e insertar. Cuando haya usuarios, las políticas pasarán al rol `authenticated`.
- No hay políticas de `update` ni de `delete`. Por eso, desde la app no se pueden cambiar `combustible`, `en_reparacion` ni `ultima_revision`; eso llega con E2. Para preparar los datos de prueba de T-07, esos valores se cambian a mano desde el panel de Supabase.
- La regla "la fecha de despegue no puede ser anterior a hoy" no se valida en la base de datos, porque depende del día en que se crea la misión. Se valida en el dominio.

## 2. Tipos de TypeScript
Archivos: `src/types/nave.ts` y `src/types/mision.ts`. Los nombres van en camelCase; los servicios traducen desde y hacia snake_case.

```ts
// src/types/nave.ts
export const CLASES_NAVE = ['exploradora', 'carguera', 'transporte'] as const;
export type ClaseNave = (typeof CLASES_NAVE)[number];

export interface Nave {
  id: string;
  nombre: string;
  clase: ClaseNave;
  combustible: number; // entero de 0 a 100
  enReparacion: boolean;
  ultimaRevision: string; // ISO 8601
  createdAt: string; // ISO 8601
}

// Lo que escribe el jefe en el formulario, antes de validar
export interface BorradorNave {
  nombre: string;
  clase: string;
  combustible: number | null;
}

export type ErroresNave = Partial<Record<keyof BorradorNave, string>>;
```

```ts
// src/types/mision.ts
export interface Mision {
  id: string;
  naveId: string;
  destino: string;
  fechaDespegue: string; // YYYY-MM-DD
  duracionDias: number; // entero >= 1
  createdAt: string; // ISO 8601
}

export interface BorradorMision {
  naveId: string;
  destino: string;
  fechaDespegue: string; // YYYY-MM-DD o ''
  duracionDias: number | null;
}

export type ErroresMision = Partial<Record<keyof BorradorMision, string>>;

export type MotivoRechazo = 'combustible_insuficiente' | 'revision_pendiente' | 'en_reparacion';

export type Aptitud = { puede: true } | { puede: false; motivos: MotivoRechazo[] };
```

## 3. Funciones puras (`src/dominio/`)
Ninguna de estas funciones lee el reloj ni llama a Supabase.

### `validarNave(borrador: BorradorNave): ErroresNave`
Archivo: `src/dominio/nave.ts`. Devuelve `{}` si los datos son válidos.

| Condición | Campo | Mensaje |
|---|---|---|
| Nombre vacío o solo espacios | `nombre` | Escribe el nombre de la nave. |
| Clase vacía o fuera de `CLASES_NAVE` | `clase` | Elige la clase de la nave: exploradora, carguera o transporte. |
| Combustible `null` | `combustible` | Indica el combustible de la nave. |
| Combustible no entero, menor que 0 o mayor que 100 | `combustible` | El combustible debe ser un número entero entre 0 y 100. |

`validarNave` no comprueba si el nombre está repetido, porque eso necesita la base de datos. Lo comprueba `navesService.crear`.

### `validarMision(borrador: BorradorMision, hoy: string): ErroresMision`
Archivo: `src/dominio/mision.ts`. `hoy` llega en formato `YYYY-MM-DD`, y las fechas se comparan como texto en ese formato.

| Condición | Campo | Mensaje |
|---|---|---|
| Nave vacía | `naveId` | Elige la nave. |
| Destino vacío o solo espacios | `destino` | Escribe el destino. |
| Fecha vacía | `fechaDespegue` | Indica la fecha de despegue. |
| Fecha anterior a `hoy` | `fechaDespegue` | La fecha de despegue no puede ser anterior a hoy. |
| Duración `null` | `duracionDias` | Indica la duración en días. |
| Duración no entera o menor que 1 | `duracionDias` | La duración debe ser un número entero de días, como mínimo 1. |

### `puedeRecibirMision(nave, misionesDesdeRevision): Aptitud`
Archivo: `src/dominio/aptitud.ts`. Recibe `nave: Pick<Nave, 'combustible' | 'enReparacion'>` y `misionesDesdeRevision: number`.

Acumula todos los motivos que se cumplan, en este orden:
1. `combustible < 25` → `combustible_insuficiente`
2. `misionesDesdeRevision > 3` → `revision_pendiente`
3. `enReparacion` → `en_reparacion`

Si no se cumple ninguno, devuelve `{ puede: true }`.

El mismo archivo exporta `MENSAJES_MOTIVO: Record<MotivoRechazo, string>`, que usan `ListaNaves` y `FormularioMision`:

| Motivo | Mensaje |
|---|---|
| `combustible_insuficiente` | Combustible insuficiente: necesita al menos un 25 %. |
| `revision_pendiente` | Necesita revisión: lleva más de 3 misiones desde la última. |
| `en_reparacion` | La nave está en reparación. |

## 4. Servicios (`src/services/`)
Son los únicos que importan el cliente de `src/lib/supabase.ts`. Cada servicio traduce las filas de snake_case a los tipos de camelCase. Ante un error inesperado (red, permisos), el servicio lanza un `Error` y el componente muestra un mensaje genérico.

### `navesService` (`src/services/navesService.ts`)
- `listar(): Promise<Nave[]>`: todas las naves, ordenadas por nombre.
- `crear(borrador: BorradorNave): Promise<ResultadoCrearNave>`, que funciona así:
  1. Recorta el nombre y llama a `validarNave`. Si hay errores, devuelve `{ ok: false, errores }` sin llamar a la base de datos.
  2. Inserta la nave.
  3. Si la base de datos responde con violación de unicidad (código `23505`), devuelve `{ ok: false, errores: { nombre: 'Ya existe una nave con ese nombre.' } }`.
  4. Si todo va bien, devuelve `{ ok: true, nave }`.

```ts
type ResultadoCrearNave = { ok: true; nave: Nave } | { ok: false; errores: ErroresNave };
```

### `misionesService` (`src/services/misionesService.ts`)
- `contarDesdeRevision(nave: Pick<Nave, 'id' | 'ultimaRevision'>): Promise<number>`: cuenta las misiones de la nave con `created_at > ultima_revision`. Usa `count: 'exact', head: true`, así que no descarga filas.
- `crear(borrador: BorradorMision, hoy: string): Promise<ResultadoCrearMision>`, que funciona así:
  1. Llama a `validarMision(borrador, hoy)`. Si hay errores, devuelve `datos_invalidos`.
  2. Vuelve a leer la nave desde la base de datos, para no fiarse de una pantalla desactualizada, y llama a `contarDesdeRevision`.
  3. Llama a `puedeRecibirMision`. Si no puede, devuelve `nave_no_apta` con los motivos y no inserta nada.
  4. Inserta la misión y devuelve `creada`.

```ts
type ResultadoCrearMision =
  | { estado: 'creada'; mision: Mision }
  | { estado: 'datos_invalidos'; errores: ErroresMision }
  | { estado: 'nave_no_apta'; motivos: MotivoRechazo[] };
```

## 5. Componentes (`src/components/`)
Ningún componente importa Supabase; todos usan los servicios. "Hoy" se obtiene con `fechaLocalHoy()` de `src/lib/fecha.ts`, que devuelve la fecha local del navegador en formato `YYYY-MM-DD`.

### `FormularioNave`
- **Campos:** nombre (texto), clase (selector con las tres clases y una opción vacía "Elige una clase") y combustible (número, de 0 a 100).
- **Errores:** debajo de cada campo se muestra el mensaje de `validarNave`, o "Ya existe una nave con ese nombre." si el nombre está repetido.
- **Éxito:** muestra «Nave «{nombre}» registrada.», vacía el formulario y avisa a `ListaNaves` para que recargue.
- **Error inesperado:** «No se pudo registrar la nave. Inténtalo de nuevo.»

### `ListaNaves`
- **Por cada nave:** nombre, clase, combustible en %, misiones desde la última revisión, "En reparación" u "Operativa", y "Apta" o "No apta", seguido de los mensajes de `MENSAJES_MOTIVO`.
- **Aptitud:** se calcula con `puedeRecibirMision`, usando `misionesService.contarDesdeRevision` para cada nave. Con una flota pequeña basta una consulta por nave.
- **Sin naves:** «Todavía no hay naves registradas.»
- **Error al cargar:** «No se pudo cargar la flota.»

### `FormularioMision`
- **Campos:** nave (selector con las naves de `navesService.listar`), destino (texto), fecha de despegue (fecha, con mínimo `hoy`) y duración en días (número entero, mínimo 1).
- **Datos inválidos:** debajo de cada campo se muestra el mensaje de `validarMision`.
- **Nave no apta:** «No se puede asignar la misión a «{nombre}»:», seguido de la lista de mensajes de `MENSAJES_MOTIVO`.
- **Éxito:** «Misión a {destino} asignada a «{nombre}»: despega el {fecha}, {n} días.» Después vacía el formulario y avisa a `ListaNaves` para que recargue.
- **Error inesperado:** «No se pudo asignar la misión. Inténtalo de nuevo.»

`src/App.tsx` monta los tres componentes en una sola pantalla.

## 6. Criterios de aceptación

### HU-1.1 · Registrar una nave
- **HU-1.1-CA1:** al registrar una nave con un nombre nuevo, clase carguera y 60 % de combustible, la app DEBE mostrarla en la flota con ese nombre, clase y combustible, 0 misiones desde la última revisión, "Operativa" y "Apta".
- **HU-1.1-CA2:** el formulario DEBE ofrecer solo las clases exploradora, carguera y transporte, y NO DEBE aceptar ninguna otra.
- **HU-1.1-CA3:** una nave registrada con un 25 % de combustible DEBE aparecer como apta.
- **HU-1.1-CA4:** una nave registrada con un 10 % de combustible DEBE quedar registrada y aparecer como no apta por combustible insuficiente.
- **HU-1.1-CA5:** la app NO DEBE registrar una nave sin nombre, y DEBE mostrar «Escribe el nombre de la nave.».
- **HU-1.1-CA6:** la app NO DEBE registrar una nave sin clase, y DEBE mostrar el mensaje de clase.
- **HU-1.1-CA7:** la app NO DEBE registrar una nave sin combustible, y DEBE mostrar «Indica el combustible de la nave.».
- **HU-1.1-CA8:** la app NO DEBE registrar una nave con combustible menor que 0, mayor que 100 o no entero, y DEBE mostrar el mensaje de rango.
- **HU-1.1-CA9:** si ya existe una nave llamada "Aurora", la app NO DEBE registrar otra con ese nombre, y DEBE mostrar «Ya existe una nave con ese nombre.».

### HU-1.3 · Asignar una misión a una nave apta
- **HU-1.3-CA1:** al asignar a una nave apta (60 %, 1 misión, operativa) una misión con destino, despegue mañana y 5 días, la app DEBE guardarla y mostrar la confirmación con destino, fecha y duración.
- **HU-1.3-CA2:** al asignar una misión a una nave apta con 2 misiones desde la última revisión, la nave DEBE pasar a mostrar 3 misiones y DEBE seguir apta.
- **HU-1.3-CA3:** con 3 misiones desde la última revisión y el resto en regla, la app DEBE aceptar la misión.
- **HU-1.3-CA4:** con 4 misiones desde la última revisión, la app NO DEBE asignar la misión, y DEBE indicar que la nave necesita revisión.
- **HU-1.3-CA5:** con un 24 % de combustible, la app NO DEBE asignar la misión, y DEBE indicar combustible insuficiente.
- **HU-1.3-CA6:** con un 25 % de combustible y el resto en regla, la app DEBE aceptar la misión.
- **HU-1.3-CA7:** con la nave en reparación, la app NO DEBE asignar la misión, y DEBE indicar que la nave está en reparación.
- **HU-1.3-CA8:** con poco combustible y 4 misiones a la vez, la app NO DEBE asignar la misión, y DEBE mostrar los dos motivos.
- **HU-1.3-CA9:** la app NO DEBE asignar una misión sin nave, destino, fecha de despegue o duración, y DEBE indicar qué dato falta.
- **HU-1.3-CA10:** la app DEBE aceptar una misión con fecha de despegue hoy.
- **HU-1.3-CA11:** la app NO DEBE aceptar una misión con fecha de despegue ayer, y DEBE mostrar «La fecha de despegue no puede ser anterior a hoy.».
- **HU-1.3-CA12:** la app DEBE aceptar una misión de 1 día.
- **HU-1.3-CA13:** la app NO DEBE aceptar una misión de 0 días, de días negativos o de 2,5 días, y DEBE mostrar el mensaje de duración.

## 7. Verificación por criterio
- **Vitest (dominio):** test de las funciones puras, sin base de datos.
- **Manual:** prueba en el navegador contra Supabase.

| Criterio | Verificación | Qué se comprueba |
|---|---|---|
| HU-1.1-CA1 | Manual | Registrar la nave y verla en la lista con todos sus datos. |
| HU-1.1-CA2 | Vitest + manual | `validarNave` rechaza una clase desconocida; el selector solo ofrece tres clases. |
| HU-1.1-CA3 | Vitest | `puedeRecibirMision({ combustible: 25, enReparacion: false }, 0)` → `puede: true`. |
| HU-1.1-CA4 | Vitest | Con un 10 % → motivos `['combustible_insuficiente']`. |
| HU-1.1-CA5 | Vitest | `validarNave` con nombre `''` y `'   '` → error en `nombre`. |
| HU-1.1-CA6 | Vitest | `validarNave` con clase `''` → error en `clase`. |
| HU-1.1-CA7 | Vitest | `validarNave` con combustible `null` → error en `combustible`. |
| HU-1.1-CA8 | Vitest | -1, 101 y 24,5 → error; 0 y 100 → sin error. |
| HU-1.1-CA9 | Manual | Registrar "Aurora" dos veces; la segunda muestra el aviso. |
| HU-1.3-CA1 | Manual | Asignar la misión y ver la confirmación. |
| HU-1.3-CA2 | Manual | Asignar una misión a una nave con 2 misiones y ver que pasa a 3 y sigue apta. |
| HU-1.3-CA3 | Vitest | 3 misiones → `puede: true`. |
| HU-1.3-CA4 | Vitest | 4 misiones → motivos `['revision_pendiente']`. |
| HU-1.3-CA5 | Vitest | 24 % → motivos `['combustible_insuficiente']`. |
| HU-1.3-CA6 | Vitest | 25 % → `puede: true`. |
| HU-1.3-CA7 | Vitest + manual | `enReparacion: true` → motivos `['en_reparacion']`; en el navegador, con una nave puesta en reparación desde el panel. |
| HU-1.3-CA8 | Vitest | 10 % y 4 misiones → los dos motivos. |
| HU-1.3-CA9 | Vitest | `validarMision` con cada campo vacío → error en ese campo. |
| HU-1.3-CA10 | Vitest | Fecha igual a `hoy` → sin error. |
| HU-1.3-CA11 | Vitest | Fecha de ayer → error en `fechaDespegue`. |
| HU-1.3-CA12 | Vitest | Duración 1 → sin error. |
| HU-1.3-CA13 | Vitest | 0, -1 y 2,5 → error en `duracionDias`. |

## 8. Tickets y archivos
Respecto al backlog, este reparto cambia una cosa: la migración completa y `contarDesdeRevision` se adelantan a T-03, porque `ListaNaves` necesita contar misiones para mostrar la aptitud.

| Ticket | Crea | Modifica |
|---|---|---|
| T-01 · Preparar el proyecto | `package.json`, `vite.config.ts`, `tsconfig.json`, `.prettierrc`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/lib/supabase.ts`, `.env.example` (solo nombres de variables, sin valores) | — |
| T-02 · Reglas de la nave y aptitud | `src/types/nave.ts`, `src/types/mision.ts` (`MotivoRechazo`, `Aptitud`), `src/dominio/nave.ts`, `src/dominio/nave.test.ts`, `src/dominio/aptitud.ts`, `src/dominio/aptitud.test.ts` | — |
| T-03 · Guardar y mostrar naves | `supabase/migraciones/001_hangar.sql`, `src/services/navesService.ts`, `src/services/misionesService.ts` (`contarDesdeRevision`), `src/components/FormularioNave.tsx`, `src/components/ListaNaves.tsx` | `src/App.tsx` |
| T-04 · Verificar HU-1.1 | — | `src/dominio/*.test.ts` (si falta algún caso), esta spec (resultados de la prueba manual) |
| T-05 · Reglas de la misión | `src/dominio/mision.ts`, `src/dominio/mision.test.ts`, `src/lib/fecha.ts` | `src/types/mision.ts` (`Mision`, `BorradorMision`, `ErroresMision`) |
| T-06 · Guardar la misión | `src/components/FormularioMision.tsx` | `src/services/misionesService.ts` (`crear`), `src/App.tsx` |
| T-07 · Verificar HU-1.3 | — | `src/dominio/*.test.ts` (si falta algún caso), esta spec (resultados de la prueba manual) |

Variables de entorno que lee `src/lib/supabase.ts`: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Sus valores van en `.env.local`, que no forma parte de esta spec.

## Pendientes
1. **El bloqueo solo vive en el frontend:** con la política de insertar abierta a `anon`, alguien con la clave pública podría crear una misión para una nave no apta sin pasar por la app. Para garantizar la métrica de éxito, más adelante habrá que validar la aptitud en la base de datos.
2. **Nombres que solo difieren en mayúsculas:** sigue sin decidirse si "Aurora" y "aurora" cuentan como el mismo nombre.
