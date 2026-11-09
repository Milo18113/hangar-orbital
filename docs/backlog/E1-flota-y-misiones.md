# E1 · Flota y misiones — Historias de usuario

Épica: [docs/backlog/epicas.md](epicas.md). PRD: [docs/prd/hangar-mvp.md](../prd/hangar-mvp.md).
Rol único: jefe de hangar (todos tienen el mismo permiso).

## Historias del MVP

### HU-1.1 · Registrar una nave
**Estado:** refinada.

Como jefe de hangar, quiero registrar una nave nueva del hangar, para que quede en la flota y podamos asignarle misiones.
- **Alcance PRD:** A1 (registrar naves).
- **Nota:** según el supuesto del PRD, la nave se registra con su combustible actual y el contador de misiones a cero. Anotar el combustible es parte de E2; aquí solo se recoge el valor inicial.
- **Reglas del PRD que aplican:** R1 (aptitud) y los supuestos de combustible en porcentaje de 0 a 100 y de contador inicial a cero.
- **Decisiones del cliente:**
  - El nombre, la clase y el combustible son obligatorios.
  - El nombre no se puede repetir.
  - La clase es exploradora, carguera o transporte.

#### Criterios de aceptación
1. **Registro correcto**
   - DADO que estoy en la flota,
   - CUANDO registro una nave con un nombre nuevo, la clase carguera y un 60 % de combustible,
   - ENTONCES la nave aparece en la flota con su nombre, clase carguera, 60 % de combustible, 0 misiones desde la última revisión, fuera de dique seco, sin misiones pendientes y como apta.
2. **Clases disponibles**
   - DADO que estoy registrando una nave,
   - CUANDO elijo la clase,
   - ENTONCES solo puedo elegir entre exploradora, carguera y transporte.
3. **Exactamente un cuarto de tanque (R1)**
   - DADO que estoy en la flota,
   - CUANDO registro una nave con un 25 % de combustible,
   - ENTONCES la nave aparece como apta.
4. **Poco combustible (R1)**
   - DADO que estoy en la flota,
   - CUANDO registro una nave con un 10 % de combustible,
   - ENTONCES la nave queda registrada, pero aparece como no apta por falta de combustible.
5. **Sin nombre**
   - DADO que estoy registrando una nave,
   - CUANDO intento guardarla sin nombre,
   - ENTONCES la app no la registra y me avisa de que falta el nombre.
6. **Sin clase**
   - DADO que estoy registrando una nave,
   - CUANDO intento guardarla sin elegir una clase,
   - ENTONCES la app no la registra y me avisa de que falta la clase.
7. **Sin combustible anotado**
   - DADO que estoy registrando una nave,
   - CUANDO intento guardarla sin indicar el combustible,
   - ENTONCES la app no la registra y me avisa de que falta el combustible.
8. **Combustible fuera de rango**
   - DADO que estoy registrando una nave,
   - CUANDO indico un combustible menor que 0 % o mayor que 100 %,
   - ENTONCES la app no la registra y me avisa de que el valor debe estar entre 0 y 100.
9. **Nombre repetido**
   - DADO que ya existe en la flota una nave llamada "Aurora",
   - CUANDO intento registrar otra nave llamada "Aurora",
   - ENTONCES la app no la registra y me avisa de que ese nombre ya está en uso.

#### Casos borde sin cubrir
- Nombres que solo se diferencian en mayúsculas o espacios ("Aurora", "aurora", "Aurora "): ¿cuentan como el mismo nombre?
- Un nombre formado solo por espacios: ¿cuenta como "sin nombre"?
- Combustible con decimales (por ejemplo, 24,9 %): ¿se acepta y cómo se compara con el umbral del 25 %?
- Registrar una nave con el tanque al 0 %: ¿se acepta o se rechaza?
- Dos jefes registran a la vez una nave con el mismo nombre desde pantallas distintas.
- ¿Se puede registrar una nave que entra directamente en dique seco, o siempre se registra fuera de él?

### HU-1.2 · Consultar la flota
**Estado:** refinada.

Como jefe de hangar, quiero ver la lista de todas las naves registradas, para saber con qué naves cuenta el hangar.
- **Alcance PRD:** A4 (parcial: la lista de naves). Mostrar si cada nave está apta y por qué es parte de E2.
- **Nota:** la aptitud y sus motivos ya se muestran en la flota desde HU-1.1 y HU-1.3, porque T-02 y T-03 los adelantaron. Esta refinación fija cómo tiene que leerse la flota; no cambia ninguna regla ni ningún texto de la spec 01. Cómo se ve (colores, tipografía, componentes) lo decide `DESIGN.md`, no esta historia.
- **Reglas del PRD que aplican:** R1 (aptitud): una nave es apta con al menos un 25 % de combustible, con menos de 3 misiones desde su última revisión y fuera de dique seco.
- **Spec:** [docs/specs/02-interfaz-flota.md](../specs/02-interfaz-flota.md).

#### Criterios de aceptación
1. **Todas las naves a la vista**
   - DADO que hay naves registradas,
   - CUANDO abro la app,
   - ENTONCES veo en la flota todas las naves, cada una con su nombre, su clase, su combustible, sus misiones desde la última revisión y si está operativa o en reparación.
2. **Orden por nombre**
   - DADO que registré las naves "Duna", "Aurora" y "Ceniza", en ese orden,
   - CUANDO miro la flota,
   - ENTONCES las veo ordenadas por nombre: Aurora, Ceniza, Duna.
3. **Distingo de un vistazo qué naves pueden despegar**
   - DADO una flota con naves aptas y no aptas,
   - CUANDO la miro,
   - ENTONCES distingo cuáles pueden despegar y cuáles no sin abrir ni pulsar nada; la indicación está siempre en el mismo lugar de cada nave y se lee con palabras, sin depender de distinguir colores.
4. **Por qué una nave no es apta**
   - DADO una nave no apta,
   - CUANDO la miro,
   - ENTONCES veo todos los motivos a la vez, con las mismas palabras que me da la app cuando rechaza una misión; una nave apta no muestra motivos.
5. **Combustible y su mínimo**
   - DADO una nave con combustible,
   - CUANDO la miro,
   - ENTONCES veo cuánto combustible tiene y si está por debajo del mínimo que necesita para recibir una misión; una nave con exactamente el mínimo no está por debajo.
6. **Misiones y su máximo**
   - DADO una nave con misiones desde su última revisión,
   - CUANDO la miro,
   - ENTONCES veo cuántas lleva y cuántas admite como máximo antes de necesitar revisión.
7. **Reparación**
   - DADO una nave en dique seco y otra operativa,
   - CUANDO miro la flota,
   - ENTONCES distingo la que está en reparación de la que está operativa.
8. **La flota se actualiza sola**
   - DADO que estoy viendo la flota,
   - CUANDO registro una nave o asigno una misión,
   - ENTONCES la flota refleja el cambio sin que yo recargue la página.
9. **Flota vacía**
   - DADO que no hay naves registradas,
   - CUANDO abro la app,
   - ENTONCES veo «Todavía no hay naves registradas.».
10. **Mientras carga**
    - DADO que la flota tarda en llegar,
    - CUANDO abro la app,
    - ENTONCES veo «Cargando la flota…» hasta que aparece.
11. **Error al cargar**
    - DADO que la flota no se puede cargar,
    - CUANDO abro la app,
    - ENTONCES veo «No se pudo cargar la flota.» y ninguna nave, ni siquiera una lista parcial.
12. **En computador y en celular**
    - DADO que abro la app en una pantalla ancha o en una angosta,
    - CUANDO consulto la flota,
    - ENTONCES veo todas las naves sin tener que desplazarme de lado.

#### Casos borde sin cubrir
- **Flota grande:** hoy se cargan todas las naves y se cuentan sus misiones una por una. No está decidido si hará falta paginar o filtrar.
- **Nombres muy largos:** ¿se cortan o se parten en varias líneas?
- **Naves no aptas:** filtrarlas o agruparlas pertenece a E2.
- **Cambios de otro jefe:** la flota se actualiza con lo que hago yo en esta pantalla, no con lo que registre otro jefe desde otra. ¿Hace falta que se refresque sola?

### HU-1.3 · Asignar una misión a una nave apta
**Estado:** refinada.

Como jefe de hangar, quiero asignar una misión a una nave, y que la app lo impida si la nave no es apta, para que ninguna nave no apta salga a misión.
- **Alcance PRD:** A2 (asignar misiones con bloqueo). **Reglas:** R2.
- **Depende de:** la regla de aptitud R1 (E2).
- **Punto abierto que la afecta:** si una nave puede tener dos misiones con fechas superpuestas.
- **Reglas del PRD que aplican:** R1 (aptitud), R2 (no se asigna a una nave no apta), R3 (asignar suma al contador) y R6 (una nave en dique seco no recibe misiones).
- **Decisiones del cliente:**
  - Una misión necesita nave, destino, fecha de despegue y duración.
  - La fecha de despegue puede ser hoy, pero no anterior.
  - La duración es un número entero de días, como mínimo 1.
  - Una nave en reparación no recibe misiones.

#### Criterios de aceptación
1. **Asignación a una nave apta (R2)**
   - DADO una nave con un 60 % de combustible, 1 misión asignada desde la última revisión y fuera de dique seco,
   - CUANDO le asigno una misión con destino, fecha de despegue mañana y duración de 5 días,
   - ENTONCES la misión aparece como pendiente de esa nave, con su destino, fecha y duración.
2. **Asignar suma al contador (R3)**
   - DADO una nave apta con 2 misiones asignadas desde la última revisión,
   - CUANDO le asigno una misión válida,
   - ENTONCES la nave pasa a mostrar 3 misiones desde la última revisión y deja de ser apta hasta su próxima revisión.
3. **Límite exacto de misiones (R1)**
   - DADO una nave con 2 misiones asignadas desde la última revisión y el resto de condiciones en regla,
   - CUANDO le asigno una misión válida,
   - ENTONCES la app la acepta.
4. **Demasiadas misiones sin revisión (R1, R2)**
   - DADO una nave con 3 misiones asignadas desde la última revisión,
   - CUANDO intento asignarle una misión,
   - ENTONCES la app no la asigna y me indica que la nave necesita revisión.
5. **Combustible insuficiente (R1, R2)**
   - DADO una nave con un 24 % de combustible,
   - CUANDO intento asignarle una misión,
   - ENTONCES la app no la asigna y me indica que el combustible es insuficiente.
6. **Combustible justo en el límite (R1)**
   - DADO una nave con un 25 % de combustible y el resto de condiciones en regla,
   - CUANDO le asigno una misión válida,
   - ENTONCES la app la acepta.
7. **Nave en reparación (R6, R2)**
   - DADO una nave en dique seco, aunque tenga combustible y pocas misiones,
   - CUANDO intento asignarle una misión,
   - ENTONCES la app no la asigna y me indica que la nave está en reparación.
8. **Varios motivos a la vez**
   - DADO una nave con poco combustible y 3 misiones desde la última revisión,
   - CUANDO intento asignarle una misión,
   - ENTONCES la app no la asigna y me indica los dos motivos, no solo uno.
9. **Datos obligatorios de la misión**
   - DADO que estoy asignando una misión,
   - CUANDO intento guardarla sin nave, sin destino, sin fecha de despegue o sin duración,
   - ENTONCES la app no la asigna y me avisa de qué dato falta.
10. **Despegue hoy**
    - DADO una nave apta,
    - CUANDO le asigno una misión con fecha de despegue hoy,
    - ENTONCES la app la acepta.
11. **Despegue en el pasado**
    - DADO una nave apta,
    - CUANDO intento asignarle una misión con fecha de despegue ayer,
    - ENTONCES la app no la asigna y me avisa de que la fecha no puede ser anterior a hoy.
12. **Duración mínima**
    - DADO una nave apta,
    - CUANDO le asigno una misión de 1 día,
    - ENTONCES la app la acepta.
13. **Duración no válida**
    - DADO una nave apta,
    - CUANDO intento asignarle una misión de 0 días, de días negativos o de 2,5 días,
    - ENTONCES la app no la asigna y me avisa de que la duración debe ser un número entero de días, como mínimo 1.

#### Casos borde sin cubrir
- **Fechas superpuestas (punto abierto del PRD):** no está decidido si una nave puede tener dos misiones cuyas fechas se solapen.
- **Qué día es "hoy":** si los jefes trabajan en turnos de noche o en zonas horarias distintas, hay que acordar con qué reloj se decide que una fecha ya pasó.
- **Pantalla desactualizada:** la nave era apta cuando la vi, pero otro jefe la puso en dique seco antes de que yo confirmara. ¿La app vuelve a comprobar la aptitud al confirmar?
- **Dos jefes asignando a la vez** una misión a la misma nave.
- **Misión repetida:** ¿se puede asignar a la misma nave dos misiones con el mismo destino y la misma fecha?
- **Fecha de despegue muy lejana:** ¿hay un máximo, o una misión puede programarse para dentro de años?
- **Combustible para la misión:** una nave al 25 % es apta aunque la misión vaya a consumir más. Es un riesgo aceptado, porque el cálculo de consumo está fuera de alcance, pero conviene dejarlo explícito con el cliente.

### HU-1.4 · Ver las misiones pendientes de una nave
**Estado:** por refinar.

Como jefe de hangar, quiero ver las misiones pendientes de cada nave, para saber qué tiene asignado antes de darle otra misión o completarla.
- **Alcance PRD:** A2 (necesaria para gestionar las misiones asignadas).

### HU-1.5 · Completar una misión
**Estado:** por refinar.

Como jefe de hangar, quiero marcar una misión pendiente como completada, para dejar constancia de que la nave volvió y anotar el combustible que le queda.
- **Alcance PRD:** A2 (marcar como completadas). **Reglas:** R4. La misión ya sumó al contador al asignarse (R3), así que completarla no lo cambia.
- **Nota:** anotar el combustible restante al completar es obligatorio (R4), pero esa parte pertenece a E2. Las dos historias tienen que salir juntas.

## Historias fuera de alcance
Se dejan anotadas para no perderlas, pero no entran en el MVP.

### HU-1.6 · Cancelar una misión — fuera de alcance
Como jefe de hangar, quiero cancelar una misión pendiente, para liberar la nave si la misión ya no se va a hacer.
- **Motivo:** el PRD asume que una misión solo puede estar pendiente o completada, sin misiones canceladas ([SUPUESTO]).

### HU-1.7 · Editar o dar de baja una nave — fuera de alcance
Como jefe de hangar, quiero corregir los datos de una nave o darla de baja, para que la flota refleje la realidad.
- **Motivo:** el alcance del PRD no lo incluye. Si se necesita para corregir errores de registro, habría que añadirlo al PRD.

### HU-1.8 · Asignar tripulación a una misión — fuera de alcance
Como jefe de hangar, quiero asignar tripulantes a una misión, para saber quién va a bordo.
- **Motivo:** la tripulación es no-alcance explícito (la gestiona el Centro de Comando).

### HU-1.9 · Consultar el historial de misiones — pendiente de decisión
Como jefe de hangar, quiero ver las misiones completadas de una nave, para revisar su actividad pasada.
- **Motivo:** el PRD tiene abierto si hace falta conservar el historial. No entra en el MVP hasta que se decida.

## Tickets del sprint
Historias del sprint: HU-1.1 y HU-1.3. Según AGENTS.md, ninguna funcionalidad se implementa sin spec, así que antes de T-02 tiene que existir en `docs/specs/` la spec de las dos historias.

La interfaz de HU-1.2 (T-08 a T-11) se hace con la spec 02 y el sistema de diseño `DESIGN.md`.

### HU-1.1 · Registrar una nave

#### T-01 · Preparar el proyecto
**Estado:** hecho.

- **Historia:** HU-1.1 (también la necesita HU-1.3).
- **Tipo:** Configuración.
- **Descripción:** crear el proyecto con su stack, los tests y el formato, y dejar listo en `src/lib/supabase.ts` el cliente de Supabase. El cliente lee la URL y la clave pública desde variables de entorno.
- **Definition of Done:**
  - [x] `npm run dev` arranca la app vacía.
  - [x] `npm test` se ejecuta y pasa al menos un test de prueba.
  - [x] `npm run build` compila sin errores.
  - [x] Prettier está configurado y el código está formateado.
  - [x] El cliente de Supabase usa solo la clave pública y no hay claves escritas en el código.
  - [x] Existen las carpetas previstas en AGENTS.md.
- **Dependencias:** ninguna.

#### T-02 · Reglas de la nave: registro y aptitud
**Estado:** hecho.

- **Historia:** HU-1.1.
- **Tipo:** Modelo/Dominio.
- **Descripción:** en `src/types/` y `src/dominio/`, definir la nave y sus tres clases, y escribir dos funciones puras:
  - una que valide los datos de registro (nombre, clase y combustible entre 0 y 100);
  - una que calcule si la nave está apta y por qué motivos no (R1).
- **Nota:** la aptitud es una regla de E2, pero aquí se adelanta lo mínimo, porque HU-1.1 la muestra y HU-1.3 la usa para bloquear.
- **Definition of Done:**
  - [x] Hay tests unitarios para cada regla de validación, incluidos los límites (0 %, 100 %, valores fuera de rango, nombre o clase vacíos).
  - [x] Hay tests de aptitud en los límites (25 % y 24 %; 2 y 3 misiones; dentro y fuera de dique seco) y para varios motivos a la vez.
  - [x] Ningún tipo usa `any`.
  - [x] `npm test` pasa.
- **Dependencias:** T-01 y la spec de HU-1.1.

#### T-03 · Guardar y mostrar naves
**Estado:** pendiente: el código está hecho, pero falta verificar en el navegador lo que se ve en pantalla.

- **Historia:** HU-1.1.
- **Tipo:** Datos/Interfaz.
- **Descripción:** añadir la migración de naves y misiones, y un servicio en `src/services/` para registrar y listar naves. Añadir también la función que cuenta las misiones de una nave desde su última revisión, porque la lista la necesita para mostrar la aptitud. Añadir también un componente con el formulario de registro y la lista de naves, que muestre si cada nave está apta usando T-02.
- **Definition of Done:**
  - [x] La migración está en `supabase/migraciones/`, en snake_case, e impide nombres repetidos.
  - [x] Solo el servicio llama a Supabase; el componente no.
  - [ ] El formulario muestra el aviso de cada dato que falta o no es válido, y el de nombre repetido. *(Implementado; sin verificar en el navegador.)*
  - [ ] Una nave nueva aparece en la lista con su clase, su combustible, 0 misiones, fuera de dique seco y su aptitud. *(Implementado; sin verificar en el navegador.)*
  - [x] `npm test` y `npm run build` pasan.
- **Dependencias:** T-02.
- **Bloqueado en parte por:** si "Aurora" y "aurora " cuentan como el mismo nombre (caso borde abierto).

#### T-04 · Verificar los criterios de HU-1.1
**Estado:** pendiente: faltan los resultados del navegador en `docs/VERIFICACION.md`.

- **Historia:** HU-1.1.
- **Tipo:** Test.
- **Descripción:** comprobar los 9 criterios de aceptación de HU-1.1, con tests automáticos donde se pueda y con una prueba manual en pantalla para el resto.
- **Definition of Done:**
  - [ ] Cada criterio (1–9) tiene un test o una prueba manual anotada con su resultado. *(CA3 a CA8 tienen test; CA1, CA2 y CA9 no tienen resultado anotado.)*
  - [ ] Los criterios 1, 3 y 4 (aptitud visible) se comprueban en la pantalla.
  - [x] `npm test` y `npm run build` pasan.
- **Dependencias:** T-03.

### HU-1.3 · Asignar una misión a una nave apta

#### T-05 · Reglas de la misión y de la asignación
**Estado:** hecho.

- **Historia:** HU-1.3.
- **Tipo:** Modelo/Dominio.
- **Descripción:** en `src/types/` y `src/dominio/`, definir la misión y escribir una función pura que decida si se puede asignar. Comprueba los datos obligatorios, que la fecha no sea anterior a hoy y que la duración sea un entero de 1 o más. Además, usa la aptitud de T-02 y devuelve todos los motivos de rechazo.
- **Definition of Done:**
  - [x] Hay tests de datos que faltan, de fecha hoy y ayer, y de duración 1, 0, negativa y decimal.
  - [x] Hay tests de rechazo por aptitud, y uno que comprueba que se devuelven varios motivos a la vez. *(Están en `aptitud.test.ts`. La combinación de validación y aptitud vive en `misionesService.crear`, que no tiene test unitario.)*
  - [x] "Hoy" se recibe como parámetro, para que los tests no dependan del reloj.
  - [x] Ningún tipo usa `any` y `npm test` pasa.
- **Dependencias:** T-02 y la spec de HU-1.3.
- **Bloqueado en parte por:** con qué reloj se decide qué día es "hoy" (caso borde abierto).

#### T-06 · Guardar la misión y mostrar el resultado
**Estado:** pendiente: el código está hecho, pero falta verificar en el navegador lo que se ve en pantalla y lo que queda guardado.

- **Historia:** HU-1.3.
- **Tipo:** Datos/Interfaz.
- **Descripción:** añadir un servicio que asigne misiones a una nave. La migración de misiones se adelanta a T-03 (ver la spec 01). En este sprint las misiones no tienen estado: el estado llegará con HU-1.5. El servicio vuelve a comprobar la aptitud con los datos actuales antes de guardar. Añadir también un componente con el formulario de asignación, que muestre la misión pendiente o los motivos de rechazo.
- **Definition of Done:**
  - [x] Solo el servicio llama a Supabase.
  - [ ] Al asignar una misión, el contador de misiones de la nave sube en 1 (R3). *(Sin verificar: V-17.)*
  - [ ] Una asignación rechazada no deja ninguna misión guardada. *(En el código, `crear` vuelve antes de insertar; falta comprobarlo en Supabase.)*
  - [ ] La pantalla muestra la misión pendiente con su destino, fecha y duración, o todos los motivos de rechazo. *(Sin verificar: V-10, V-11 y V-20.)*
  - [x] `npm test` y `npm run build` pasan.
- **Dependencias:** T-03 y T-05.

#### T-07 · Verificar los criterios de HU-1.3
**Estado:** pendiente: faltan los resultados del navegador en `docs/VERIFICACION.md`.

- **Historia:** HU-1.3.
- **Tipo:** Test.
- **Descripción:** comprobar los 13 criterios de aceptación de HU-1.3, con tests automáticos donde se pueda y con una prueba manual en pantalla para el resto.
- **Definition of Done:**
  - [ ] Cada criterio (1–13) tiene un test o una prueba manual anotada con su resultado. *(CA3 a CA6 y CA8 a CA13 tienen test; CA1, CA2 y CA7 no tienen resultado anotado.)*
  - [ ] La prueba manual incluye una nave en dique seco y una con 3 misiones, preparadas a mano porque esas funciones son de E2.
  - [x] `npm test` y `npm run build` pasan.
- **Dependencias:** T-06.

### HU-1.2 · Consultar la flota (interfaz)
Estos tickets aplican [DESIGN.md](../../DESIGN.md) a la pantalla de la spec 01, según la [spec 02](../specs/02-interfaz-flota.md). Ninguno toca `src/dominio/`, `src/services/` ni `supabase/`. Los ids `U-xx` son las filas de [docs/VERIFICACION-UI.md](../VERIFICACION-UI.md).

#### T-08 · Tokens, base y fuentes
**Estado:** hecho.

- **Historia:** HU-1.2 (también la usan los formularios de HU-1.1 y HU-1.3).
- **Tipo:** Configuración.
- **Descripción:** crear los tokens de `DESIGN.md` §4 en `src/styles/tokens.css`, los estilos base y la regla de movimiento reducido en `src/styles/base.css`, cargar IBM Plex desde Google Fonts en `index.html` e importar las hojas desde `src/main.tsx`.
- **Definition of Done:**
  - [x] `tokens.css` define todos los tokens de `DESIGN.md` §4. *(Comprobado: todo token citado en `DESIGN.md` existe en `tokens.css`.)*
  - [x] Ningún archivo de `src/` fuera de `tokens.css` contiene un color hexadecimal (D-01, U-01).
  - [x] `index.html` carga las tres variantes de IBM Plex con `display=swap` y mantiene `lang="es"`.
  - [x] `base.css` desactiva las transiciones con `prefers-reduced-motion: reduce`.
  - [x] `main.tsx` importa `tokens.css`, `base.css` y `componentes.css`, en ese orden.
  - [x] `npm test` y `npm run build` pasan.
- **Dependencias:** la spec 02 y `DESIGN.md`.

#### T-09 · Tarjeta de nave
**Estado:** pendiente: el código está hecho, pero falta verificar en el navegador lo que se ve en pantalla.

- **Historia:** HU-1.2.
- **Tipo:** Interfaz.
- **Descripción:** crear `src/styles/componentes.css` y los componentes «Tarjeta de nave» (con «Insignia de estado»), «Barra de combustible» y «Contador de misiones». La flota pasa de tabla a lista de tarjetas y muestra los «Estados de la flota» (cargando, vacía y error). La barra y el contador leen sus umbrales de `src/dominio/aptitud.ts`.
- **Definition of Done:**
  - [x] La flota es un `ul` con un `li` por nave, y cada tarjeta sigue el orden de `DESIGN.md` §6.7.
  - [x] La barra y el contador importan `COMBUSTIBLE_MINIMO` y `MAX_MISIONES_SIN_REVISION`; no hay un 25 ni un 3 escritos a mano.
  - [x] La barra expone `role="meter"` con `aria-valuemin`, `aria-valuemax`, `aria-valuenow` y `aria-label`.
  - [ ] La aptitud se ve con texto en la esquina superior derecha de cada tarjeta (D-03, U-07). *(Implementado; sin verificar en el navegador.)*
  - [ ] Una nave no apta muestra todos sus motivos (D-04, U-08). *(Implementado; sin verificar en el navegador.)*
  - [ ] La barra marca el umbral y se pinta en rojo por debajo de él (D-05, U-09). *(Implementado; sin verificar en el navegador.)*
  - [ ] El contador muestra «n de 3» y tantas marcas como el máximo (D-06, U-10). *(Implementado; sin verificar en el navegador.)*
  - [ ] Los tres estados de la flota se ven con los textos de la spec 01 (U-05, U-13, U-14). *(Los textos están en el código; sin verificar en pantalla.)*
  - [x] `npm test` y `npm run build` pasan.
- **Dependencias:** T-08 y T-03.

#### T-10 · Formularios y avisos
**Estado:** pendiente: el código está hecho, pero falta verificar en el navegador lo que se ve en pantalla.

- **Historia:** HU-1.2 (aplica a los formularios de HU-1.1 y HU-1.3).
- **Tipo:** Interfaz.
- **Descripción:** aplicar «Campo de formulario», «Botón» y «Avisos» a `FormularioNave` y `FormularioMision`, sin cambiar sus textos ni su comportamiento.
- **Definition of Done:**
  - [x] Cada campo tiene su etiqueta asociada con `for` / `id`, y cada error se enlaza con `aria-describedby` (I-01, U-03).
  - [x] El aviso de éxito usa `role="status"` y el de error, `role="alert"`.
  - [ ] Un campo con error tiene borde rojo, mensaje debajo y `aria-invalid="true"` (D-08, U-18). *(Implementado; sin verificar en el navegador.)*
  - [ ] Al recorrer la app con Tab, todo control muestra el foco en cian (D-07, U-17). *(Implementado; sin verificar en el navegador.)*
  - [ ] Los textos visibles coinciden con los de la spec 01 (D-10, U-19). *(Sin verificar en el navegador.)*
  - [x] `npm test` y `npm run build` pasan.
- **Dependencias:** T-08, T-09 (comparten `componentes.css`), T-03 y T-06.

#### T-11 · Layout del tablero
**Estado:** pendiente: el código está hecho, pero falta verificar en el navegador lo que se ve en pantalla.

- **Historia:** HU-1.2.
- **Tipo:** Interfaz.
- **Descripción:** montar en `src/App.tsx` el encabezado, el «Tablero» y los «Panel», y añadir sus reglas a `componentes.css`: dos columnas desde 900 px y una sola por debajo.
- **Definition of Done:**
  - [x] El encabezado muestra «Hangar Orbital» y, debajo, «Control de despegues».
  - [x] «Registrar nave» y «Asignar misión» están en un panel con su `h2`, y «Flota» tiene su propia sección.
  - [ ] A 1280 px el tablero tiene dos columnas, y a 390 px una, sin scroll horizontal (D-09, U-15 y U-16). *(Implementado; sin verificar en el navegador.)*
  - [ ] En una columna, el orden es «Registrar nave», «Asignar misión» y «Flota» (U-16). *(Implementado; sin verificar en el navegador.)*
  - [x] `npm test` y `npm run build` pasan.
- **Dependencias:** T-09 y T-10.

### Orden de ejecución sugerido
1. **Antes de empezar:** la spec de HU-1.1 y HU-1.3 en `docs/specs/`.
2. **T-01:** preparar el proyecto.
3. **T-02:** reglas de la nave y aptitud. Las dos historias dependen de él.
4. **T-03 y T-05 en paralelo.** No dependen entre sí.
5. **T-04:** verificar HU-1.1. Así queda cerrada la primera historia.
6. **T-06:** guardar y mostrar la misión.
7. **T-07:** verificar HU-1.3.
8. **Antes de T-08:** la spec 02 en `docs/specs/`.
9. **T-08:** tokens, base y fuentes. Todo lo visual depende de él.
10. **T-09, T-10 y T-11, en ese orden.** Los tres añaden secciones a `componentes.css`, así que no conviene hacerlos en paralelo.

Para preparar las naves de prueba de T-07, hace falta cambiar a mano el contador de misiones y el dique seco, porque las pantallas que hacen eso son de E2.
