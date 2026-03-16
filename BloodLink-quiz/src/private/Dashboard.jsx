import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { getGamificacao, getHistorico, getPerfil } from "../api/user";

const Dashboard = () => {
  const navigate = useNavigate();
  const { getToken, logout } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [gamificacao, setGamificacao] = useState(null);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      logout();
      navigate("/login", { replace: true });
      return;
    }

    Promise.all([
      getPerfil(token),
      getHistorico(token),
      getGamificacao(token),
    ])
      .then(([perfilData, historicoData, gamificacaoData]) => {
        setPerfil(perfilData);
        setHistorico(historicoData);
        setGamificacao(gamificacaoData);
      })
      .catch((error) => {
        if (error?.code === "UNAUTHORIZED") {
          logout();
          navigate("/login", { replace: true });
        }
      });
  }, [getToken, logout, navigate]);

  return (
    <div className="page-grid">
      <section className="card">
        <h1>Dashboard do dador</h1>
        <p>Dados pessoais, proxima data de doacao, pontos e historico.</p>
      </section>
      <section className="card">
        <h2>Dados pessoais</h2>
        <p><strong>Nome:</strong> {perfil?.nome ?? "-"}</p>
        <p><strong>Email:</strong> {perfil?.email ?? "-"}</p>
        <p><strong>Grupo:</strong> {perfil?.grupoSanguineo ?? "-"}</p>
      </section>
      <section className="card">
        <h2>Proxima data possivel de doacao</h2>
        <p>{perfil?.proximaDoacaoPermitida ?? "2026-03-14"}</p>
        <p><strong>Pontos:</strong> {gamificacao?.pontos ?? 0}</p>
        <p><strong>Medalhas:</strong> {gamificacao?.medalhas?.map(m => m.nome).join(", ") ?? "-"}</p>
      </section>
      <section className="card">
        <h2>Historico de dadivas</h2>
        <ul>
          {historico.map((item) => (
            <li key={item.id}>{item.data} · {item.local} · {item.tipo}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
