import { useEffect, useState } from "react";
import { getQuizPublico } from "../api/quiz";

const QuizPublic = () => {
  const [quiz, setQuiz] = useState({ perguntas: [] });
  const [atual, setAtual] = useState(0);
  const [selecionada, setSelecionada] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [terminado, setTerminado] = useState(false);

  useEffect(() => {
    getQuizPublico().then(setQuiz);
  }, []);

  const pergunta = quiz.perguntas[atual];
  const total = quiz.perguntas.length;

  const escolher = (idx) => {
    if (respondida) return;
    setSelecionada(idx);
    setRespondida(true);
    if (idx === pergunta.correta) {
      setPontuacao((p) => p + 1);
    }
  };

  const proxima = () => {
    if (atual + 1 >= total) {
      setTerminado(true);
    } else {
      setAtual((a) => a + 1);
      setSelecionada(null);
      setRespondida(false);
    }
  };

  const reiniciar = () => {
    setAtual(0);
    setSelecionada(null);
    setRespondida(false);
    setPontuacao(0);
    setTerminado(false);
  };

  if (!total) return null;

  /* ---------- ecra de resultado ---------- */
  if (terminado) {
    const percentagem = Math.round((pontuacao / total) * 100);
    let mensagem, cor;
    if (percentagem >= 80) {
      mensagem = "Excelente! Sabe muito sobre doacao de sangue.";
      cor = "#147a3b";
    } else if (percentagem >= 50) {
      mensagem = "Bom resultado! Continue a aprender sobre doacao.";
      cor = "#8a6505";
    } else {
      mensagem = "Pode melhorar! Visite a seccao de Educacao para saber mais.";
      cor = "#962d22";
    }

    return (
      <div className="card page-grid" style={{ textAlign: "center" }}>
        <h1>Resultado do Quiz</h1>
        <div style={{ fontSize: "3rem", fontWeight: 700, color: cor }}>
          {pontuacao}/{total}
        </div>
        <p style={{ fontSize: "1.1rem", margin: "0.5rem 0" }}>
          Acertou {percentagem}% das perguntas
        </p>
        <p style={{ color: cor, fontWeight: 600 }}>{mensagem}</p>
        <div>
          <button onClick={reiniciar}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  /* ---------- ecra de pergunta ---------- */
  return (
    <div className="card page-grid">
      {/* barra de progresso */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
          {atual + 1} / {total}
        </span>
        <div
          style={{
            flex: 1,
            height: 8,
            borderRadius: 999,
            background: "rgba(17,19,24,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((atual + 1) / total) * 100}%`,
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #7b1fa2, #d81b60)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      <h2 style={{ margin: 0 }}>{pergunta.texto}</h2>

      {/* opcoes */}
      <div style={{ display: "grid", gap: "0.65rem" }}>
        {pergunta.opcoes.map((opcao, idx) => {
          let bg = "rgba(17,19,24,0.04)";
          let border = "1px solid rgba(17,19,24,0.10)";
          let fontW = 400;

          if (respondida) {
            if (idx === pergunta.correta) {
              bg = "rgba(46,204,113,0.15)";
              border = "1px solid rgba(46,204,113,0.4)";
              fontW = 600;
            } else if (idx === selecionada) {
              bg = "rgba(231,76,60,0.15)";
              border = "1px solid rgba(231,76,60,0.4)";
            }
          } else if (idx === selecionada) {
            bg = "rgba(123,31,162,0.10)";
            border = "1px solid rgba(123,31,162,0.3)";
          }

          return (
            <button
              key={idx}
              onClick={() => escolher(idx)}
              disabled={respondida}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "0.85rem 1.1rem",
                borderRadius: 12,
                background: bg,
                border,
                color: "#111318",
                fontWeight: fontW,
                fontSize: "0.95rem",
                cursor: respondida ? "default" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ marginRight: "0.6rem", fontWeight: 700, opacity: 0.5 }}>
                {String.fromCharCode(65 + idx)}.
              </span>
              {opcao}
            </button>
          );
        })}
      </div>

      {/* feedback apos resposta */}
      {respondida && (
        <div
          style={{
            padding: "1rem 1.2rem",
            borderRadius: 12,
            background:
              selecionada === pergunta.correta
                ? "rgba(46,204,113,0.10)"
                : "rgba(231,76,60,0.10)",
            border:
              selecionada === pergunta.correta
                ? "1px solid rgba(46,204,113,0.25)"
                : "1px solid rgba(231,76,60,0.25)",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>
            {selecionada === pergunta.correta ? "Correto!" : "Incorreto!"}
          </p>
          <p style={{ margin: "0.4rem 0 0", fontSize: "0.92rem", opacity: 0.85 }}>
            {pergunta.explicacao}
          </p>
        </div>
      )}

      {/* botao avancar */}
      {respondida && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={proxima}>
            {atual + 1 >= total ? "Ver resultado" : "Proxima pergunta"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPublic;
