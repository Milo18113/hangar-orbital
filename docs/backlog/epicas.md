# Hangar Orbital — Épicas del MVP

Basado en [docs/prd/hangar-mvp.md](../prd/hangar-mvp.md). Los números de alcance (A1–A4) y de reglas (R1–R7) remiten a las secciones 4 y 6 del PRD.

## E1 · Flota y misiones
**Objetivo:** que los jefes tengan registradas todas las naves del hangar y puedan asignarles misiones solo cuando estén aptas.

**Alcance que cubre:**
- A1 (parcial): registrar naves.
- A2 (parcial): asignar misiones a una nave, impidiéndolo si no es apta, y marcarlas como completadas.
- A4 (parcial): consultar la lista de naves.

**Reglas de negocio:**
- R2: no se puede asignar una misión a una nave no apta. La aptitud la calcula E2.
- R3: una misión suma al contador de la nave en cuanto se asigna.

## E2 · Mantenimiento
**Objetivo:** que los jefes sepan en todo momento qué naves no están aptas y por qué, y mantengan al día el combustible, las revisiones y la reparación.

**Alcance que cubre:**
- A1 (parcial): anotar el nivel de combustible.
- A2 (parcial): anotar el combustible restante al completar una misión.
- A3 (completo): registrar revisiones y poner naves en dique seco o sacarlas de él.
- A4 (parcial): ver qué naves están aptas y, si no lo están, por qué.

**Reglas de negocio:**
- R1: definición de apta (combustible del 25 % o más, menos de 3 misiones desde la última revisión y fuera de dique seco).
- R4: el combustible es obligatorio al completar una misión y se puede corregir en cualquier momento.
- R5: una revisión pone el contador de misiones a cero.
- R6: al entrar en dique seco, la nave pierde sus misiones pendientes y no puede recibir otras nuevas.
- R7: salir del dique seco cuenta como revisión.

## Cobertura del alcance
Ningún punto del alcance quedó fuera de ambas épicas. Aun así:
- A1, A2 y A4 se reparten entre las dos épicas. La parte de "flota" va a E1; la de combustible y aptitud, a E2.
- Completar misiones no aparece de forma explícita en la descripción de E1 ("asignarles misiones"), pero la incluyo ahí porque cierra el ciclo de la misión.
- **Dependencia:** el bloqueo de R2 en E1 necesita la regla de aptitud R1 de E2. Conviene implementar primero el cálculo de aptitud o desarrollar ambas épicas en paralelo.
