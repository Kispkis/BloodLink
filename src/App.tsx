import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./app/components/Navbar";
import ProtectedRoute from "./app/components/ProtectedRoute";
import Landing from "./app/pages/Landing";
import Login from "./app/pages/Login";
import Register from "./app/pages/Register";
import Home from "./app/pages/Home";
import Reservas from "./app/pages/Reservas";
import Postos from "./app/pages/Postos";
import Brigadas from "./app/pages/Brigadas";
import Perfil from "./app/pages/Perfil";
import EditarPerfil from "./app/pages/EditarPerfil";
import Quiz from "./app/pages/Quiz";
import { useAuth } from "./app/hooks/useAuth";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-shell">
      {isAuthenticated && <Navbar />}
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/postos" element={<Postos />} />
            <Route path="/brigadas" element={<Brigadas />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/perfil/editar" element={<EditarPerfil />} />
          </Route>
          <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
