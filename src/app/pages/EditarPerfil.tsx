import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const normalizeSpaces = (value: string) => value.trim().replace(/\s+/g, " ");

const EditarPerfil = () => {
  const { user, profile, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const initial = useMemo(
    () => ({
      fullName: normalizeSpaces(profile?.fullName ?? user?.displayName ?? ""),
      phone: normalizeSpaces(profile?.phone ?? ""),
      birthDate: profile?.birthDate ?? "",
    }),
    [profile?.birthDate, profile?.fullName, profile?.phone, user?.displayName],
  );

  const [fullName, setFullName] = useState(initial.fullName);
  const [phone, setPhone] = useState(initial.phone);
  const [birthDate, setBirthDate] = useState(initial.birthDate);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFullName(initial.fullName);
    setPhone(initial.phone);
    setBirthDate(initial.birthDate);
  }, [initial.birthDate, initial.fullName, initial.phone]);

  const validate = () => {
    const normalizedName = normalizeSpaces(fullName);
    const nameParts = normalizedName.split(" ").filter(Boolean);

    if (normalizedName.length < 5 || nameParts.length < 2) {
      setError("Indique o nome completo (pelo menos 2 nomes).");
      return false;
    }

    const phoneTrimmed = normalizeSpaces(phone);
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
    const age =
      today.getFullYear() -
      date.getFullYear() -
      (today < new Date(today.getFullYear(), date.getMonth(), date.getDate()) ? 1 : 0);

    if (age < 18) {
      setError("Tem de ter pelo menos 18 anos.");
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
      await updateUserProfile({
        fullName: normalizeSpaces(fullName),
        phone: normalizeSpaces(phone),
        birthDate,
      });
      navigate("/perfil", { replace: true });
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : "";
      setError(message || "Nao foi possivel actualizar o perfil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="profile-edit-page">
      <div className="card profile-edit-card">
        <header className="profile-edit-header">
          <h1>Editar perfil</h1>
          <p>Actualize os seus dados basicos.</p>
        </header>

        <form className="profile-edit-form" onSubmit={handleSubmit}>
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

          {error && <p className="error-text">{error}</p>}

          <div className="profile-edit-actions">
            <Link className="button button-secondary" to="/perfil">
              Cancelar
            </Link>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "A guardar..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditarPerfil;
