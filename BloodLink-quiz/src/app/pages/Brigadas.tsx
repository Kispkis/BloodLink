import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import type { Brigada } from "../services/api";

const Brigadas = () => {
  const { fetchBrigadas } = useApi();
  const [brigadas, setBrigadas] = useState<Brigada[]>([]);

  useEffect(() => {
    fetchBrigadas().then(setBrigadas);
  }, [fetchBrigadas]);

  const getClassName = (estado: Brigada["estado"]) =>
    estado === "Aberta" ? "status-pill ok" : "status-pill alert";

  return (
    <div className="page-grid">
      <div className="card">
        <h1>Brigadas moveis</h1>
        <p>Planeamento mock das deslocacoes previstas.</p>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Local</th>
              <th>Data</th>
              <th>Capacidade</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {brigadas.length === 0 ? (
              <tr>
                <td colSpan={4}>Sem dados disponiveis.</td>
              </tr>
            ) : (
              brigadas.map((brigada) => (
                <tr key={brigada.id}>
                  <td>{brigada.local}</td>
                  <td>{brigada.data}</td>
                  <td>{brigada.capacidade}</td>
                  <td>
                    <span className={getClassName(brigada.estado)}>{brigada.estado}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Brigadas;
