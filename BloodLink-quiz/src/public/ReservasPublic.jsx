import { useEffect, useState } from "react";
import { getReservasPublicas } from "../api/reservas";

const ReservasPublic = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getReservasPublicas().then(setItems);
  }, []);

  return (
    <div className="page-grid">
      <div className="card">
        <h1>Niveis de reservas</h1>
        <p>Informacao publica sem autenticacao.</p>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>ID</th><th>Tipo</th><th>Bolsas</th><th>Data</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5}>Sem dados disponiveis.</td></tr>
            ) : items.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.tipo}</td>
                <td>{reserva.quantidade}</td>
                <td>{reserva.data}</td>
                <td>{reserva.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservasPublic;
