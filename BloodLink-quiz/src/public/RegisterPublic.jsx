import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const RegisterPublic = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!fullName || !phone || !birthDate || !email.includes("@") || password.length < 6 || password !== confirmPassword) {
      setError("Valide os dados do registo.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await register({
        email,
        password,
        profile: {
          fullName,
          phone,
          birthDate,
        },
      });
    } catch {
      setError("Nao foi possivel criar conta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <h1>Criar conta</h1>
        <p>Registo para aceder a historico e gamificacao.</p>
        <div className="form-group">
          <label htmlFor="fullName">Nome completo</label>
          <input id="fullName" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">Data de nascimento</label>
          <input id="birthDate" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Contacto</label>
          <input id="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar password</label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "A criar..." : "Criar conta"}</button>
        <p className="auth-links">Ja tem conta? <Link to="/login">Entrar</Link></p>
      </form>
    </section>
  );
};

export default RegisterPublic;
