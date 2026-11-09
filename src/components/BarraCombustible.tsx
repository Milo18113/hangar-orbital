import { COMBUSTIBLE_MINIMO } from '../dominio/aptitud';

interface Props {
  combustible: number;
}

export default function BarraCombustible({ combustible }: Props) {
  const bajo = combustible < COMBUSTIBLE_MINIMO;

  return (
    <div className="combustible">
      <span className="etiqueta">Combustible</span>
      <div className="combustible-fila">
        <div
          className="pista"
          role="meter"
          aria-label="Combustible"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={combustible}
        >
          {/* El ancho es dinámico: es la única excepción a la regla de estilos en línea (D-02) */}
          <span
            className={bajo ? 'relleno relleno--bajo' : 'relleno'}
            style={{ width: `${combustible}%` }}
          />
          {/* SVG: así el umbral sale del dominio sin añadir otro estilo en línea */}
          <svg className="umbral" viewBox="0 0 100 1" preserveAspectRatio="none" aria-hidden="true">
            <line
              x1={COMBUSTIBLE_MINIMO}
              y1={0}
              x2={COMBUSTIBLE_MINIMO}
              y2={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <span className="cifra">{combustible} %</span>
      </div>
    </div>
  );
}
