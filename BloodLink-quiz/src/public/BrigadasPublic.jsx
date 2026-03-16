import { useEffect, useState } from "react";
import { getBrigadasPublicas } from "../api/brigadas";

const BrigadasPublic = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getBrigadasPublicas().then(setItems);
  }, []);

  return (
    <div className="page-grid">
      <div className="card">
        <h1>Brigadas moveis</h1>
        <p>Agenda publica das brigadas em deslocacao.</p>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Local</th><th>Data</th><th>Capacidade</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={4}>Sem dados disponiveis.</td></tr>
            ) : items.map((brigada) => (
              <tr key={brigada.id}>
                <td>{brigada.local}</td>
                <td>{brigada.data}</td>
                <td>{brigada.capacidade}</td>
                <td>{brigada.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BrigadasPublic;
