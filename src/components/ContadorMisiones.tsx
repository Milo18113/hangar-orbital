import { MAX_MISIONES_SIN_REVISION } from '../dominio/aptitud';

interface Props {
  misiones: number;
}

export default function ContadorMisiones({ misiones }: Props) {
  const marcas = Array.from({ length: MAX_MISIONES_SIN_REVISION }, (_, indice) => indice);

  return (
    <div className="contador">
      <span className="etiqueta">Misiones desde la revisión</span>
      <span className="contador-valor">
        <span className="marcas" aria-hidden="true">
          {marcas.map((indice) => (
            <span key={indice} className={indice < misiones ? 'marca marca--ocupada' : 'marca'} />
          ))}
        </span>
        <span className="cifra">
          {misiones} de {MAX_MISIONES_SIN_REVISION}
        </span>
      </span>
    </div>
  );
}
