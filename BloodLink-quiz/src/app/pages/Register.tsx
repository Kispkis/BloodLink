import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = (location.state as { from?: Location })?.from?.pathname ?? "/home";
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const validate = () => {
    if (!fullName || !birthDate || !phone || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return false;
    }

    const normalizedName = fullName.trim().replace(/\s+/g, " ");
    const nameParts = normalizedName.split(" ").filter(Boolean);
    if (normalizedName.length < 5 || nameParts.length < 2) {
      setError("Indique o nome completo (pelo menos 2 nomes).");
      return false;
    }

    const phoneTrimmed = phone.trim();
    if (!/^\+?\d[\d\s]{7,}$/.test(phoneTrimmed)) {
      setError("Contacto invalido. Use apenas numeros (pode incluir +351) e espacos.");
      return false;
    }

    const date = new Date(`${birthDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      setError("Data de nascimento invalida.");
      return false;
    }

    const today = new Date();
    const age = today.getFullYear() - date.getFullYear() - (today < new Date(today.getFullYear(), date.getMonth(), date.getDate()) ? 1 : 0);
    if (age < 18) {
      setError("Tem de ter pelo menos 18 anos.");
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

    if (password !== confirmPassword) {
      setError("Passwords nao coincidem.");
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
      await register({
        email,
        password,
        profile: {
          fullName: fullName.trim().replace(/\s+/g, " "),
          phone: phone.trim().replace(/\s+/g, " "),
          birthDate,
        },
      });
      // Firebase autentica automaticamente após criar a conta.
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : "";

      if (message.includes("auth/email-already-in-use")) {
        setError("Este email ja esta registado. Entre em vez de criar conta.");
      } else if (message.includes("auth/invalid-email")) {
        setError("Email invalido.");
      } else if (message.includes("auth/weak-password")) {
        setError("Password fraca. Use pelo menos 6 caracteres.");
      } else {
        setError("Nao foi possivel criar conta. Confirme a configuracao Firebase.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <h1>Criar conta</h1>
        <p>Registe-se para utilizar o BloodLink.</p>
        <div className="form-group">
          <label htmlFor="fullName">Nome completo</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Ex: Joao Silva"
            autoComplete="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">Data de nascimento</label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            autoComplete="bday"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Contacto</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Ex: +351 912 345 678"
            autoComplete="tel"
          />
        </div>
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
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="repita a password"
            autoComplete="new-password"
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "A criar..." : "Criar conta"}
        </button>
        <p className="auth-links">
          Ja tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
