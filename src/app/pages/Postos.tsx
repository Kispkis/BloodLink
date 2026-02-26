import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import type { Posto } from "../services/api";

const Postos = () => {
  const { fetchPostos } = useApi();
  const [postos, setPostos] = useState<Posto[]>([]);

  useEffect(() => {
    fetchPostos().then(setPostos);
  }, [fetchPostos]);

  return (
    <div className="page-grid">
      <div className="card">
        <h1>Postos de colheita</h1>
        <p>Dados mock ate a integracao com a API oficial.</p>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Posto</th>
              <th>Cidade</th>
              <th>Horario</th>
              <th>Contacto</th>
            </tr>
          </thead>
          <tbody>
            {postos.length === 0 ? (
              <tr>
                <td colSpan={4}>Sem dados disponiveis.</td>
              </tr>
            ) : (
              postos.map((posto) => (
                <tr key={posto.id}>
                  <td>{posto.nome}</td>
                  <td>{posto.cidade}</td>
                  <td>{posto.horario}</td>
                  <td>{posto.contacto}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Postos;
