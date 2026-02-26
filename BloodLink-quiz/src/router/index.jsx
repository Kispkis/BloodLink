import { Navigate, Route, Routes } from "react-router-dom";
import AuthGuard from "../auth/AuthGuard";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import HomePublic from "../public/HomePublic";
import ReservasPublic from "../public/ReservasPublic";
import BrigadasPublic from "../public/BrigadasPublic";
import QuizPublic from "../public/QuizPublic";
import EducacaoPublic from "../public/EducacaoPublic";
import Dashboard from "../private/Dashboard";
import Perfil from "../private/Perfil";
import Historico from "../private/Historico";
import Gamificacao from "../private/Gamificacao";
import NotificacoesPrivadas from "../private/NotificacoesPrivadas";
import LoginPublic from "../public/LoginPublic";
import RegisterPublic from "../public/RegisterPublic";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePublic />} />
        <Route path="/reservas" element={<ReservasPublic />} />
        <Route path="/brigadas" element={<BrigadasPublic />} />
        <Route path="/quiz" element={<QuizPublic />} />
        <Route path="/educacao" element={<EducacaoPublic />} />
      </Route>

      <Route path="/login" element={<LoginPublic />} />
      <Route path="/register" element={<RegisterPublic />} />

      <Route
        element={(
          <AuthGuard>
            <PrivateLayout />
          </AuthGuard>
        )}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/gamificacao" element={<Gamificacao />} />
        <Route path="/notificacoes" element={<NotificacoesPrivadas />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
