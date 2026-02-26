import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotificacoesPersonalizadas } from "../api/user";
import { useAuth } from "../auth/useAuth";

const NotificacoesPrivadas = () => {
  const navigate = useNavigate();
  const { getToken, logout } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      logout();
      navigate("/login", { replace: true });
      return;
    }

    getNotificacoesPersonalizadas(token)
      .then(setNotificacoes)
      .catch((error) => {
        if (error?.code === "UNAUTHORIZED") {
          logout();
          navigate("/login", { replace: true });
        }
      });
  }, [getToken, logout, navigate]);

  return (
    <div className="card page-grid">
      <h1>Notificacoes personalizadas</h1>
      <ul>
        {notificacoes.map((item) => (
          <li key={item.id} style={{ opacity: item.lida ? 0.6 : 1 }}>
            <strong>{item.titulo}</strong>
            <p>{item.mensagem}</p>
            <small>{item.data} · {item.tipo}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificacoesPrivadas;
