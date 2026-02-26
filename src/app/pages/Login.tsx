import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = (location.state as { from?: Location })?.from?.pathname ?? "/home";
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const validate = () => {
    if (!email || !password) {
      setError("Preencha email e password.");
      return false;
    }

    if (!email.includes("@")) {
      setError("Email invalido.");
      return false;
    }

    if (password.length < 6) {
      setError("Password deve ter pelo menos 6 caracteres.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (submissionError) {
      setError("Nao foi possivel autenticar. Confirme as credenciais e configuracao Firebase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <h1>Entrar no BloodLink</h1>
        <p>Utilize as credenciais fornecidas pelo administrador.</p>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nome@dominio.pt"
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="minimo 6 caracteres"
            autoComplete="current-password"
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "A validar..." : "Entrar"}
        </button>
        <p className="auth-links">
          Ainda nao tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
