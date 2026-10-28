import { CLASES_NAVE, type BorradorNave, type ClaseNave, type ErroresNave } from '../types/nave';

export function esClaseNave(valor: string): valor is ClaseNave {
  return (CLASES_NAVE as readonly string[]).includes(valor);
}

// Devuelve {} si los datos son válidos. La unicidad del nombre la comprueba navesService.
export function validarNave(borrador: BorradorNave): ErroresNave {
  const errores: ErroresNave = {};

  if (borrador.nombre.trim() === '') {
    errores.nombre = 'Escribe el nombre de la nave.';
  }

  if (!esClaseNave(borrador.clase)) {
    errores.clase = 'Elige la clase de la nave: exploradora, carguera o transporte.';
  }

  const { combustible } = borrador;
  if (combustible === null) {
    errores.combustible = 'Indica el combustible de la nave.';
  } else if (!Number.isInteger(combustible) || combustible < 0 || combustible > 100) {
    errores.combustible = 'El combustible debe ser un número entero entre 0 y 100.';
  }

  return errores;
}
