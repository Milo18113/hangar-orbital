# Hangar Orbital — Mini-PRD del MVP

## 1. Problema
Hoy los jefes de hangar deciden de memoria qué nave despega. El mes pasado una nave salió con el tanque casi vacío y otra encadenó seis misiones sin pasar por revisión. No hay un sitio único donde ver si una nave está en condiciones de salir.

## 2. Usuarios
De 3 a 5 jefes de hangar, todos con el mismo permiso: cualquiera puede registrar naves, asignar y completar misiones, registrar revisiones y gestionar el dique seco.

## 3. Objetivo y métrica de éxito
- **Objetivo:** que cualquier jefe sepa en todo momento qué naves están aptas para despegar y que no se pueda mandar a misión una nave no apta.
- **Métrica:** en el primer mes de uso, cero misiones asignadas a naves no aptas. Asignar una misión equivale a autorizar el despegue.

## 4. Alcance del MVP
1. Registrar naves y anotar su nivel de combustible.
2. Asignar misiones a una nave, impidiéndolo si la nave no es apta, y marcarlas como completadas anotando el combustible que queda.
3. Registrar revisiones y poner naves en dique seco o sacarlas de él.
4. Ver en cualquier momento qué naves están aptas y, si no lo están, por qué.

## 5. No-alcance
- Tripulación (la gestiona el Centro de Comando).
- Usuarios e inicio de sesión.
- Notificaciones.
- Mapas o trayectorias.
- Cálculo automático del consumo de combustible.
- App móvil.

## 6. Reglas de negocio
1. Una nave está **apta** si cumple las tres condiciones:
   - tiene al menos un cuarto del tanque de combustible (25 % o más);
   - lleva 3 misiones completadas o menos desde su última revisión;
   - no está en dique seco.
2. No se puede asignar una misión a una nave no apta.
3. Una misión suma al contador de la nave cuando se completa, no cuando se asigna.
4. Al completar una misión es obligatorio anotar el combustible restante. El nivel se puede corregir en cualquier momento, por ejemplo tras repostar.
5. Registrar una revisión pone a cero el contador de misiones.
6. Al entrar en dique seco, la nave pierde sus misiones pendientes y no puede recibir otras nuevas mientras siga allí.
7. Salir del dique seco cuenta como revisión: el contador vuelve a cero.

## 7. Supuestos
- [SUPUESTO] El combustible se expresa como porcentaje del tanque, de 0 a 100.
- [SUPUESTO] Una nave nueva se registra con su nivel de combustible actual y el contador de misiones a cero.
- [SUPUESTO] Una misión solo tiene dos estados: pendiente y completada. No se contemplan misiones canceladas ni fallidas.
- [SUPUESTO] Los jefes acceden desde un navegador de escritorio dentro del hangar.
- [SUPUESTO] Como no hay inicio de sesión, no se registra qué jefe hizo cada acción.

## 8. Puntos abiertos
- ¿Puede una nave apta tener varias misiones pendientes a la vez? Si puede, la nave acumularía más de 3 misiones antes de completar ninguna, y la regla del contador no lo detectaría a tiempo.
- Al salir del dique seco, ¿hay que anotar también el combustible?
- Si una nave deja de ser apta teniendo misiones pendientes (por ejemplo, tras una corrección de combustible), ¿se mantienen esas misiones o se liberan?
- ¿Hace falta conservar un historial de misiones y revisiones, o basta con el estado actual de cada nave?
