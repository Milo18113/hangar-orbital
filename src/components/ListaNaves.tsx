import { useEffect, useState } from 'react';
import { MENSAJES_MOTIVO, puedeRecibirMision } from '../dominio/aptitud';
import { misionesService } from '../services/misionesService';
import { navesService } from '../services/navesService';
import type { Aptitud } from '../types/mision';
import type { Nave } from '../types/nave';

interface Props {
  // Cambia cada vez que se registra una nave o se asigna una misión
  version: number;
}

interface FilaFlota {
  nave: Nave;
  misiones: number;
  aptitud: Aptitud;
}

export default function ListaNaves({ version }: Props) {
  const [filas, setFilas] = useState<FilaFlota[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        const naves = await navesService.listar();
        const conteos = await Promise.all(naves.map((n) => misionesService.contarDesdeRevision(n)));
        if (cancelado) return;
        setFilas(
          naves.map((nave, i) => ({
            nave,
            misiones: conteos[i],
            aptitud: puedeRecibirMision(nave, conteos[i]),
          })),
        );
        setError(false);
      } catch {
        if (!cancelado) setError(true);
      }
    }

    void cargar();
    return () => {
      cancelado = true;
    };
  }, [version]);

  if (error) return <p role="alert">No se pudo cargar la flota.</p>;
  if (filas === null) return <p>Cargando la flota…</p>;
  if (filas.length === 0) return <p>Todavía no hay naves registradas.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Nave</th>
          <th>Clase</th>
          <th>Combustible</th>
          <th>Misiones desde la última revisión</th>
          <th>Estado</th>
          <th>Aptitud</th>
        </tr>
      </thead>
      <tbody>
        {filas.map(({ nave, misiones, aptitud }) => (
          <tr key={nave.id}>
            <td>{nave.nombre}</td>
            <td>{nave.clase}</td>
            <td>{nave.combustible} %</td>
            <td>{misiones}</td>
            <td>{nave.enReparacion ? 'En reparación' : 'Operativa'}</td>
            <td>
              {aptitud.puede ? (
                'Apta'
              ) : (
                <>
                  No apta
                  <ul>
                    {aptitud.motivos.map((motivo) => (
                      <li key={motivo}>{MENSAJES_MOTIVO[motivo]}</li>
                    ))}
                  </ul>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
