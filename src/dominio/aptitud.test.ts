import { describe, expect, it } from 'vitest';
import { MENSAJES_MOTIVO, puedeRecibirMision } from './aptitud';

const operativa = { combustible: 60, enReparacion: false };

describe('puedeRecibirMision', () => {
  it('acepta una nave operativa, con combustible y sin misiones', () => {
    expect(puedeRecibirMision(operativa, 0)).toEqual({ puede: true });
  });

  it('acepta una nave con exactamente un 25 % de combustible', () => {
    expect(puedeRecibirMision({ ...operativa, combustible: 25 }, 0)).toEqual({ puede: true });
  });

  it.each([24, 10, 0])('rechaza una nave con un %d % de combustible', (combustible) => {
    expect(puedeRecibirMision({ ...operativa, combustible }, 0)).toEqual({
      puede: false,
      motivos: ['combustible_insuficiente'],
    });
  });

  it('acepta una nave con exactamente 2 misiones desde la última revisión', () => {
    expect(puedeRecibirMision(operativa, 2)).toEqual({ puede: true });
  });

  it('rechaza una nave con 3 misiones desde la última revisión', () => {
    expect(puedeRecibirMision(operativa, 3)).toEqual({
      puede: false,
      motivos: ['revision_pendiente'],
    });
  });

  it('rechaza una nave en reparación aunque tenga combustible y pocas misiones', () => {
    expect(puedeRecibirMision({ ...operativa, enReparacion: true }, 0)).toEqual({
      puede: false,
      motivos: ['en_reparacion'],
    });
  });

  it('devuelve los dos motivos con poco combustible y 3 misiones', () => {
    expect(puedeRecibirMision({ ...operativa, combustible: 10 }, 3)).toEqual({
      puede: false,
      motivos: ['combustible_insuficiente', 'revision_pendiente'],
    });
  });

  it('devuelve los tres motivos en el orden de la spec', () => {
    expect(puedeRecibirMision({ combustible: 10, enReparacion: true }, 3)).toEqual({
      puede: false,
      motivos: ['combustible_insuficiente', 'revision_pendiente', 'en_reparacion'],
    });
  });
});

describe('MENSAJES_MOTIVO', () => {
  it('tiene un mensaje para cada motivo', () => {
    expect(MENSAJES_MOTIVO).toEqual({
      combustible_insuficiente: 'Combustible insuficiente: necesita al menos un 25 %.',
      revision_pendiente: 'Necesita revisión: ya tiene 3 misiones desde la última.',
      en_reparacion: 'La nave está en reparación.',
    });
  });
});
