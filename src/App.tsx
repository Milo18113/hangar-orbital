import { useState } from 'react';
import FormularioMision from './components/FormularioMision';
import FormularioNave from './components/FormularioNave';
import ListaNaves from './components/ListaNaves';

export default function App() {
  // Se incrementa para que la lista y el selector de naves vuelvan a cargar tras un cambio
  const [version, setVersion] = useState(0);
  const recargar = () => setVersion((v) => v + 1);

  return (
    <div className="contenedor">
      <header>
        <h1>Hangar Orbital</h1>
        <p className="encabezado-subtitulo">Control de despegues</p>
      </header>

      <main className="tablero">
        <div className="columna-formularios">
          <section className="panel">
            <h2>Registrar nave</h2>
            <FormularioNave onRegistrada={recargar} />
          </section>

          <section className="panel">
            <h2>Asignar misión</h2>
            <FormularioMision version={version} onAsignada={recargar} />
          </section>
        </div>

        <section className="seccion-flota">
          <h2>Flota</h2>
          <ListaNaves version={version} />
        </section>
      </main>
    </div>
  );
}
