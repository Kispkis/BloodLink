import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import type { Elegibilidade } from "../services/api";

const Perfil = () => {
  const { user, profile } = useAuth();
  const { fetchElegibilidade } = useApi();
  const [elegibilidade, setElegibilidade] = useState<Elegibilidade | null>(null);

  useEffect(() => {
    fetchElegibilidade().then(setElegibilidade);
  }, [fetchElegibilidade]);

  return (
    <div className="card page-grid">
      <header>
        <h1>Perfil do utilizador</h1>
        <p>Informacao proveniente do Firebase Auth e do registo.</p>
        <div style={{ marginTop: "1rem" }}>
          <Link className="button button-secondary" to="/perfil/editar">
            Editar perfil
          </Link>
        </div>
      </header>
      <section>
        <h2>Identificacao</h2>
        <p><strong>Nome:</strong> {user?.displayName ?? profile?.fullName ?? "-"}</p>
        <p><strong>Email:</strong> {user?.email ?? "-"}</p>
        <p><strong>Telefone:</strong> {profile?.phone ?? "-"}</p>
        <p><strong>Data de nascimento:</strong> {profile?.birthDate ?? "-"}</p>
      </section>
      <section>
        <h2>Elegibilidade</h2>
        {elegibilidade ? (
          <>
            <p><strong>Ultima doacao:</strong> {elegibilidade.ultimoAgendamento}</p>
            <p>
              <strong>Estado:</strong>{" "}
              <span className={elegibilidade.podeDoar ? "status-pill ok" : "status-pill alert"}>
                {elegibilidade.podeDoar ? "Pode doar" : "Aguarde"}
              </span>
            </p>
            <p>{elegibilidade.recomendacao}</p>
          </>
        ) : (
          <p>A carregar dados de elegibilidade...</p>
        )}
      </section>
    </div>
  );
};

export default Perfil;
