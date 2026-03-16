import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const LoginPublic = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const redirectPath = location.state?.from?.pathname ?? "/dashboard";
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.includes("@") || password.length < 6) {
      setError("Credenciais invalidas.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await login(email, password);
    } catch {
      setError("Nao foi possivel autenticar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <h1>Entrar no BloodLink</h1>
        <p>Aceda para funcionalidades pessoais.</p>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "A validar..." : "Entrar"}</button>
        <p className="auth-links">Ainda nao tem conta? <Link to="/register">Criar conta</Link></p>
      </form>
    </section>
  );
};

export default LoginPublic;
