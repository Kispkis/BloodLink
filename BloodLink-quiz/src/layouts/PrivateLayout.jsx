import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/perfil", label: "Perfil" },
  { to: "/historico", label: "Historico" },
  { to: "/gamificacao", label: "Gamificacao" },
  { to: "/notificacoes", label: "Notificacoes" },
];

const PrivateLayout = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <header className="navbar private-navbar">
        <strong>Area privada</strong>
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>{item.label}</NavLink>
        ))}
        <div className="navbar-actions">
          <button type="button" onClick={logout}>Terminar sessao</button>
        </div>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
