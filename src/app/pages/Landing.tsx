import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="landing-hero-content">
          <p className="landing-kicker">Plataforma livre para doacao de sangue</p>
          <h1>
            Bloodlink
            <span className="landing-title-accent"> liga doadores a vidas</span>
          </h1>
          <p className="landing-subtitle">
            Reserve doacoes, consulte postos e brigadas, e acompanhe a sua elegibilidade — tudo num so local.
          </p>
          <div className="landing-cta">
            {isAuthenticated ? (
              <Link className="button" to="/home">
                Entrar na plataforma
              </Link>
            ) : (
              <>
                <Link className="button" to="/register">
                  Criar conta
                </Link>
                <Link className="button button-secondary" to="/login">
                  Entrar
                </Link>
                <Link className="button button-secondary" to="/quiz">
                  Fazer quiz
                </Link>
              </>
            )}
          </div>
          <div className="landing-metrics">
            <div className="landing-metric">
              <strong>+ Rapido</strong>
              <span>Agendamentos simplificados</span>
            </div>
            <div className="landing-metric">
              <strong>+ Transparente</strong>
              <span>Estado e elegibilidade</span>
            </div>
            <div className="landing-metric">
              <strong>+ Proximo</strong>
              <span>Postos e brigadas</span>
            </div>
          </div>
        </div>

        <div className="landing-hero-visual" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="landing-card landing-card-top">
            <p className="landing-card-title">Proxima doacao</p>
            <p className="landing-card-value">Agende em minutos</p>
          </div>
          <div className="landing-card landing-card-bottom">
            <p className="landing-card-title">Elegibilidade</p>
            <p className="landing-card-value">Sempre atualizada</p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Como funciona</h2>
        <div className="landing-features">
          <article className="card landing-feature">
            <h3>Crie a sua conta</h3>
            <p>Registo com nome, contacto e data de nascimento para facilitar a identificacao.</p>
          </article>
          <article className="card landing-feature">
            <h3>Encontre postos e brigadas</h3>
            <p>Consulte locais, horarios e disponibilidade num ambiente moderno.</p>
          </article>
          <article className="card landing-feature">
            <h3>Gerencie reservas</h3>
            <p>Acompanhe e organize os seus agendamentos com estado e historico.</p>
          </article>
        </div>
      </section>

      <section className="landing-section landing-highlight">
        <div className="landing-highlight-inner">
          <h2>Feito para ser simples</h2>
          <p>
            O BloodLink foi desenhado para nao ser uma barreira: uma landing clara, autenticacao rapida e paginas objetivas.
          </p>
          {!isAuthenticated && (
            <div className="landing-cta">
              <Link className="button" to="/register">
                Comecar agora
              </Link>
              <Link className="button button-secondary" to="/login">
                Ja tenho conta
              </Link>
            </div>
          )}
        </div>
      </section>

      <footer className="landing-footer">
        <p>
          BloodLink — projecto em evolucao. Dados de postos/brigadas podem ser mock ate integracao oficial.
        </p>
      </footer>
    </main>
  );
};

export default Landing;
