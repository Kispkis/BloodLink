import { Link, NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/reservas", label: "Reservas" },
  { to: "/brigadas", label: "Brigadas" },
  { to: "/quiz", label: "Quiz" },
  { to: "/educacao", label: "Educacao" },
];

const PublicLayout = () => {
  return (
    <div className="app-shell">
      <header className="navbar">
        <strong>BloodLink</strong>
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>{item.label}</NavLink>
        ))}
        <div className="navbar-actions">
          <Link to="/login" className="button">Entrar</Link>
        </div>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
      <footer className="public-footer">
        <p>BloodLink · Rede nacional de dadiva de sangue</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
