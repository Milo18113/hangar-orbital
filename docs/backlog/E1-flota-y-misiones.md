# E1 · Flota y misiones — Historias de usuario

Épica: [docs/backlog/epicas.md](epicas.md). PRD: [docs/prd/hangar-mvp.md](../prd/hangar-mvp.md).
Rol único: jefe de hangar (todos tienen el mismo permiso).

## Historias del MVP

### HU-1.1 · Registrar una nave
Como jefe de hangar, quiero registrar una nave nueva del hangar, para que quede en la flota y podamos asignarle misiones.
- **Alcance PRD:** A1 (registrar naves).
- **Nota:** según el supuesto del PRD, la nave se registra con su combustible actual y el contador de misiones a cero. Anotar el combustible es parte de E2; aquí solo se recoge el valor inicial.

### HU-1.2 · Consultar la flota
Como jefe de hangar, quiero ver la lista de todas las naves registradas, para saber con qué naves cuenta el hangar.
- **Alcance PRD:** A4 (parcial: la lista de naves). Mostrar si cada nave está apta y por qué es parte de E2.

### HU-1.3 · Asignar una misión a una nave apta
Como jefe de hangar, quiero asignar una misión a una nave, y que la app lo impida si la nave no es apta, para que ninguna nave no apta salga a misión.
- **Alcance PRD:** A2 (asignar misiones con bloqueo). **Reglas:** R2.
- **Depende de:** la regla de aptitud R1 (E2).
- **Punto abierto que la afecta:** si una nave puede tener varias misiones pendientes a la vez.

### HU-1.4 · Ver las misiones pendientes de una nave
Como jefe de hangar, quiero ver las misiones pendientes de cada nave, para saber qué tiene asignado antes de darle otra misión o completarla.
- **Alcance PRD:** A2 (necesaria para gestionar las misiones asignadas).

### HU-1.5 · Completar una misión
Como jefe de hangar, quiero marcar una misión pendiente como completada, para que cuente en el contador de misiones de la nave.
- **Alcance PRD:** A2 (marcar como completadas). **Reglas:** R3.
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
