import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGamificacao } from "../api/user";
import { useAuth } from "../auth/useAuth";

const Gamificacao = () => {
  const navigate = useNavigate();
  const { getToken, logout } = useAuth();
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      logout();
      navigate("/login", { replace: true });
      return;
    }

    getGamificacao(token)
      .then(setDados)
      .catch((error) => {
        if (error?.code === "UNAUTHORIZED") {
          logout();
          navigate("/login", { replace: true });
        }
      });
  }, [getToken, logout, navigate]);

  return (
    <div className="card page-grid">
      <h1>Gamificacao</h1>
      <p><strong>Pontos:</strong> {dados?.pontos ?? 0}</p>
      <p><strong>Nivel:</strong> {dados?.nivel ?? "-"}</p>
      <p><strong>Proxima meta:</strong> {dados?.proximaMeta ?? "-"}</p>
      <ul>
        {(dados?.medalhas ?? []).map((medalha) => (
          <li key={medalha.id}>
            <strong>{medalha.nome}</strong> — {medalha.descricao}
            <span style={{ fontSize: "0.85em", opacity: 0.7 }}> ({medalha.dataConquista})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Gamificacao;
