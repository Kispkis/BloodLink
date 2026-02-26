import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { label: "Home", to: "/home" },
  { label: "Quiz", to: "/quiz" },
  { label: "Reservas", to: "/reservas" },
  { label: "Postos", to: "/postos" },
  { label: "Brigadas", to: "/brigadas" },
  { label: "Perfil", to: "/perfil" },
];

const Navbar = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Falha ao terminar sessao", error);
    }
  };

  return (
    <nav className="navbar">
      <strong>Bloodlink</strong>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {item.label}
        </NavLink>
      ))}
      <div className="navbar-actions">
        <button type="button" onClick={handleLogout}>
          Terminar sessao
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
