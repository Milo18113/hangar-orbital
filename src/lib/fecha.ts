// Fecha local del navegador en formato YYYY-MM-DD.
// No usa toISOString(), que da la fecha en UTC y puede adelantar o atrasar un día.
export function fechaLocalHoy(ahora: Date = new Date()): string {
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}
