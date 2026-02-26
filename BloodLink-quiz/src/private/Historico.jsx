import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistorico } from "../api/user";
import { useAuth } from "../auth/useAuth";

const Historico = () => {
  const navigate = useNavigate();
  const { getToken, logout } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      logout();
      navigate("/login", { replace: true });
      return;
    }

    getHistorico(token)
      .then(setItems)
      .catch((error) => {
        if (error?.code === "UNAUTHORIZED") {
          logout();
          navigate("/login", { replace: true });
        }
      });
  }, [getToken, logout, navigate]);

  return (
    <div className="card page-grid">
      <h1>Historico de dadivas</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.data} · {item.local} · {item.tipo}</li>
        ))}
      </ul>
    </div>
  );
};

export default Historico;
