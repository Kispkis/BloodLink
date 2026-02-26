import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPerfil } from "../api/user";
import { useAuth } from "../auth/useAuth";

const Perfil = () => {
  const navigate = useNavigate();
  const { getToken, logout } = useAuth();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      logout();
      navigate("/login", { replace: true });
      return;
    }

    getPerfil(token)
      .then(setPerfil)
      .catch((error) => {
        if (error?.code === "UNAUTHORIZED") {
          logout();
          navigate("/login", { replace: true });
        }
      });
  }, [getToken, logout, navigate]);

  return (
    <div className="card page-grid">
      <h1>Perfil do utilizador</h1>
      <p><strong>Nome:</strong> {perfil?.nome ?? "-"}</p>
      <p><strong>Email:</strong> {perfil?.email ?? "-"}</p>
      <p><strong>Preferencias:</strong> {perfil?.preferencia ?? "-"}</p>
    </div>
  );
};

export default Perfil;
