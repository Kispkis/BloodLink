import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import type { Reserva } from "../services/api";

const Reservas = () => {
  const { fetchReservas } = useApi();
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    fetchReservas().then(setReservas);
  }, [fetchReservas]);

  const getStatusClass = (estado: Reserva["estado"]) => {
    if (estado === "Confirmada") return "status-pill ok";
    if (estado === "Pendente") return "status-pill warn";
    return "status-pill alert";
  };

  return (
    <div className="page-grid">
      <div className="card">
        <h1>Reservas de sangue</h1>
        <p>Resumo de pedidos registados na rede de postos.</p>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Bolsas</th>
              <th>Data</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan={5}>Sem dados disponiveis.</td>
              </tr>
            ) : (
              reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.id}</td>
                  <td>{reserva.tipo}</td>
                  <td>{reserva.quantidade}</td>
                  <td>{reserva.data}</td>
                  <td>
                    <span className={getStatusClass(reserva.estado)}>{reserva.estado}</span>
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

export default Reservas;
