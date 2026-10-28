import type { BorradorMision, ErroresMision } from '../types/mision';

// `hoy` llega como YYYY-MM-DD; en ese formato las fechas se comparan bien como texto.
// Devuelve {} si los datos son válidos. La aptitud de la nave la comprueba puedeRecibirMision.
export function validarMision(borrador: BorradorMision, hoy: string): ErroresMision {
  const errores: ErroresMision = {};

  if (borrador.naveId === '') {
    errores.naveId = 'Elige la nave.';
  }

  if (borrador.destino.trim() === '') {
    errores.destino = 'Escribe el destino.';
  }

  if (borrador.fechaDespegue === '') {
    errores.fechaDespegue = 'Indica la fecha de despegue.';
  } else if (borrador.fechaDespegue < hoy) {
    errores.fechaDespegue = 'La fecha de despegue no puede ser anterior a hoy.';
  }

  const { duracionDias } = borrador;
  if (duracionDias === null) {
    errores.duracionDias = 'Indica la duración en días.';
  } else if (!Number.isInteger(duracionDias) || duracionDias < 1) {
    errores.duracionDias = 'La duración debe ser un número entero de días, como mínimo 1.';
  }

  return errores;
}
