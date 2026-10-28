import { describe, expect, it } from 'vitest';
import { validarMision } from './mision';
import type { BorradorMision } from '../types/mision';

const HOY = '2026-10-28';

const valida: BorradorMision = {
  naveId: '6f1c2a3e-0000-4000-8000-000000000001',
  destino: 'Estación Kepler',
  fechaDespegue: '2026-10-29',
  duracionDias: 5,
};

describe('validarMision', () => {
  it('acepta una misión con todos sus datos válidos', () => {
    expect(validarMision(valida, HOY)).toEqual({});
  });

  it('rechaza una misión sin nave', () => {
    expect(validarMision({ ...valida, naveId: '' }, HOY)).toEqual({ naveId: 'Elige la nave.' });
  });

  it.each(['', '   '])('rechaza el destino %j', (destino) => {
    expect(validarMision({ ...valida, destino }, HOY)).toEqual({ destino: 'Escribe el destino.' });
  });

  it('rechaza una misión sin fecha de despegue', () => {
    expect(validarMision({ ...valida, fechaDespegue: '' }, HOY)).toEqual({
      fechaDespegue: 'Indica la fecha de despegue.',
    });
  });

  it('acepta una fecha de despegue igual a hoy', () => {
    expect(validarMision({ ...valida, fechaDespegue: HOY }, HOY)).toEqual({});
  });

  it.each(['2026-10-27', '2025-12-31'])('rechaza la fecha de despegue %s', (fechaDespegue) => {
    expect(validarMision({ ...valida, fechaDespegue }, HOY)).toEqual({
      fechaDespegue: 'La fecha de despegue no puede ser anterior a hoy.',
    });
  });

  it('rechaza una misión sin duración', () => {
    expect(validarMision({ ...valida, duracionDias: null }, HOY)).toEqual({
      duracionDias: 'Indica la duración en días.',
    });
  });

  it('acepta una duración de 1 día', () => {
    expect(validarMision({ ...valida, duracionDias: 1 }, HOY)).toEqual({});
  });

  it.each([0, -1, 2.5, Number.NaN])('rechaza una duración de %d días', (duracionDias) => {
    expect(validarMision({ ...valida, duracionDias }, HOY)).toEqual({
      duracionDias: 'La duración debe ser un número entero de días, como mínimo 1.',
    });
  });

  it('devuelve todos los errores a la vez', () => {
    const vacia: BorradorMision = {
      naveId: '',
      destino: '',
      fechaDespegue: '',
      duracionDias: null,
    };
    expect(Object.keys(validarMision(vacia, HOY))).toEqual([
      'naveId',
      'destino',
      'fechaDespegue',
      'duracionDias',
    ]);
  });
});
