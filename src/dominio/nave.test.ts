import { describe, expect, it } from 'vitest';
import { validarNave } from './nave';
import type { BorradorNave } from '../types/nave';

const valido: BorradorNave = { nombre: 'Aurora', clase: 'carguera', combustible: 60 };

describe('validarNave', () => {
  it('acepta una nave con todos sus datos válidos', () => {
    expect(validarNave(valido)).toEqual({});
  });

  it.each(['exploradora', 'carguera', 'transporte'])('acepta la clase %s', (clase) => {
    expect(validarNave({ ...valido, clase })).toEqual({});
  });

  it.each(['', '   '])('rechaza el nombre %j', (nombre) => {
    expect(validarNave({ ...valido, nombre })).toEqual({ nombre: 'Escribe el nombre de la nave.' });
  });

  it.each(['', 'crucero', 'Carguera'])('rechaza la clase %j', (clase) => {
    expect(validarNave({ ...valido, clase })).toEqual({
      clase: 'Elige la clase de la nave: exploradora, carguera o transporte.',
    });
  });

  it('rechaza una nave sin combustible', () => {
    expect(validarNave({ ...valido, combustible: null })).toEqual({
      combustible: 'Indica el combustible de la nave.',
    });
  });

  it.each([-1, 101, 24.5, Number.NaN])('rechaza el combustible %d', (combustible) => {
    expect(validarNave({ ...valido, combustible })).toEqual({
      combustible: 'El combustible debe ser un número entero entre 0 y 100.',
    });
  });

  it.each([0, 25, 100])('acepta el combustible %d', (combustible) => {
    expect(validarNave({ ...valido, combustible })).toEqual({});
  });

  it('devuelve todos los errores a la vez', () => {
    expect(Object.keys(validarNave({ nombre: '', clase: '', combustible: null }))).toEqual([
      'nombre',
      'clase',
      'combustible',
    ]);
  });
});
