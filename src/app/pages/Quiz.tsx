import { Link } from "react-router-dom";
import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  avaliarPodeDoar,
  type AvaliacaoPodeDoarPayload,
  type AvaliacaoPodeDoarResponse,
} from "../services/api";

type QuizOption = {
  id: string;
  label: string;
};

type QuizQuestion = {
  id: number;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
};

const questions: QuizQuestion[] = [
  {
    id: 1,
    prompt: "Qual é a idade mínima e máxima para quem deseja doar sangue pela primeira vez em Portugal?",
    options: [
      { id: "a", label: "Entre 18 e 45 anos" },
      { id: "b", label: "Entre 18 e 60 anos" },
      { id: "c", label: "Entre 16 e 65 anos" },
      { id: "d", label: "Qualquer idade, desde que com autorização médica" },
    ],
    correctOptionId: "b",
    explanation:
      "Para a primeira dádiva, o limite de idade é geralmente os 60 anos. Dadores regulares podem continuar a doar até aos 65 anos. A maioridade legal (18 anos) é obrigatória para consentir no processo.",
  },
  {
    id: 2,
    prompt: "Qual é o peso mínimo necessário para ser dador de sangue?",
    options: [
      { id: "a", label: "45 kg" },
      { id: "b", label: "50 kg" },
      { id: "c", label: "60 kg" },
      { id: "d", label: "Não existe peso mínimo" },
    ],
    correctOptionId: "b",
    explanation:
      "Ter pelo menos 50 kg é essencial para garantir que a colheita de uma unidade de sangue padrão (aprox. 450ml) não afete a saúde ou o volume circulatório do dador.",
  },
  {
    id: 3,
    prompt: "Se fez uma tatuagem ou um piercing recentemente, quanto tempo deve aguardar até poder doar sangue?",
    options: [
      { id: "a", label: "1 mês" },
      { id: "b", label: "4 meses" },
      { id: "c", label: "1 ano" },
      { id: "d", label: "Não precisa de esperar, se o local for certificado" },
    ],
    correctOptionId: "b",
    explanation:
      "As normas atuais preveem um período de suspensão de 4 meses após estes procedimentos para garantir a segurança contra agentes infecciosos que possam estar em período de incubação.",
  },
  {
    id: 4,
    prompt: "Um homem e uma mulher podem doar sangue com a mesma frequência anual?",
    options: [
      { id: "a", label: "Sim, ambos podem doar de 3 em 3 meses" },
      { id: "b", label: "Não, os homens podem doar 4 vezes por ano e as mulheres 3 vezes" },
      { id: "c", label: "Não, as mulheres podem doar mais vezes por estarem habituadas à perda de sangue" },
      { id: "d", label: "Sim, ambos podem doar apenas 2 vezes por ano" },
    ],
    correctOptionId: "b",
    explanation:
      "Esta diferenciação protege as reservas de ferro das mulheres, permitindo 3 dádivas anuais, enquanto os homens, por não terem perdas menstruais, podem realizar 4.",
  },
  {
    id: 5,
    prompt: "O que deve fazer em relação à alimentação antes de doar sangue?",
    options: [
      { id: "a", label: "Estar em jejum absoluto" },
      { id: "b", label: "Tomar uma refeição ligeira, evitando gorduras" },
      { id: "c", label: "Comer uma refeição muito pesada para ter energia" },
      { id: "d", label: "Beber apenas café" },
    ],
    correctOptionId: "b",
    explanation:
      "Doar em jejum aumenta o risco de hipoglicemia e desmaio. Evitar gorduras é crucial para que o plasma não fique lipémico (turvo), o que impediria a sua utilização.",
  },
  {
    id: 6,
    prompt: "Se teve uma gripe ou febre, quanto tempo deve esperar após a recuperação total dos sintomas?",
    options: [
      { id: "a", label: "24 horas" },
      { id: "b", label: "7 dias" },
      { id: "c", label: "1 mês" },
      { id: "d", label: "Pode doar se já não tiver febre no momento" },
    ],
    correctOptionId: "b",
    explanation:
      "É necessário aguardar pelo menos uma semana após o fim dos sintomas para garantir que o organismo recuperou totalmente e que o agente infeccioso foi eliminado.",
  },
  {
    id: 7,
    prompt: "Quem tomou antibióticos deve aguardar quanto tempo após terminar o tratamento?",
    options: [
      { id: "a", label: "48 horas" },
      { id: "b", label: "7 dias" },
      { id: "c", label: "15 dias" },
      { id: "d", label: "Não precisa de esperar se já se sentir bem" },
    ],
    correctOptionId: "b",
    explanation:
      "O intervalo de 7 dias após a última toma serve para garantir que a infeção está resolvida e que o fármaco já não circula no sangue que será transfundido.",
  },
  {
    id: 8,
    prompt: "Pode doar sangue se for fumador?",
    options: [
      { id: "a", label: "Sim, o tabaco não é um critério de exclusão" },
      { id: "b", label: "Não, o sangue de fumadores é rejeitado" },
      { id: "c", label: "Apenas se fumar menos de 5 cigarros por dia" },
      { id: "d", label: "Sim, desde que use pensos de nicotina" },
    ],
    correctOptionId: "a",
    explanation:
      "O tabagismo por si só não impede a dádiva, embora seja recomendado não fumar nas 2 horas que antecedem e sucedem a colheita para evitar mal-estar.",
  },
  {
    id: 9,
    prompt: "Mulheres grávidas ou a amamentar podem doar sangue?",
    options: [
      { id: "a", label: "Sim, se tiverem bons níveis de ferro" },
      { id: "b", label: "Não, devem aguardar algum tempo após o parto ou o fim da amamentação" },
      { id: "c", label: "Apenas no primeiro trimestre de gravidez" },
      { id: "d", label: "Sim, mas apenas plasma" },
    ],
    correctOptionId: "b",
    explanation:
      "A suspensão protege a saúde da mãe e do bebé, uma vez que estas fases requerem todas as reservas nutricionais e de ferro do organismo feminino.",
  },
  {
    id: 10,
    prompt: "O que acontece imediatamente antes da dádiva propriamente dita?",
    options: [
      { id: "a", label: "Um exame de sangue completo em laboratório" },
      { id: "b", label: "Preenchimento de um questionário e uma triagem clínica/médica" },
      { id: "c", label: "Um teste de esforço físico" },
      { id: "d", label: "Nada, o dador vai direto para a cadeira de colheita" },
    ],
    correctOptionId: "b",
    explanation:
      "A triagem é um passo de segurança obrigatório onde se avalia o historial clínico e parâmetros vitais para garantir que a dádiva é segura naquele dia.",
  },
];

const Quiz = () => {
  const { isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [age, setAge] = useState("30");
  const [weightKg, setWeightKg] = useState("70");
  const [anemia, setAnemia] = useState(false);
  const [firstDonation, setFirstDonation] = useState(false);
  const [hadTattooOrPiercingRecently, setHadTattooOrPiercingRecently] = useState(false);
  const [hadFluOrFeverLast7Days, setHadFluOrFeverLast7Days] = useState(false);
  const [finishedAntibioticsLast7Days, setFinishedAntibioticsLast7Days] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<AvaliacaoPodeDoarResponse | null>(null);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const exitPath = isAuthenticated ? "/home" : "/";

  const isFinished = currentIndex >= questions.length;
  const currentQuestion = questions[currentIndex];
  const selectedOption = currentQuestion?.options.find((option) => option.id === selectedOptionId) ?? null;
  const correctOption = currentQuestion?.options.find((option) => option.id === currentQuestion.correctOptionId) ?? null;

  const progress = useMemo(() => {
    if (questions.length === 0) {
      return 0;
    }
    return Math.round((Math.min(currentIndex, questions.length) / questions.length) * 100);
  }, [currentIndex]);

  const finalMessage = useMemo(() => {
    const total = questions.length;
    if (total === 0) {
      return "Quiz sem perguntas.";
    }

    const ratio = score / total;

    if (ratio === 1) {
      return "Excelente! Respondeu tudo corretamente e demonstra domínio total das regras.";
    }

    if (ratio >= 0.8) {
      return "Muito bom! Tem um ótimo nível de conhecimento sobre dádiva de sangue.";
    }

    if (ratio >= 0.5) {
      return "Bom resultado. Já tem uma base sólida, mas vale rever alguns pontos.";
    }

    return "Ainda há margem para melhorar. Repetir o quiz vai ajudar a consolidar as regras.";
  }, [score]);

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedOptionId || submitted) {
      return;
    }

    if (selectedOptionId === currentQuestion.correctOptionId) {
      setScore((prev) => prev + 1);
    }

    setSubmitted(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setSelectedOptionId(null);
    setSubmitted(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOptionId(null);
    setSubmitted(false);
    setEligibilityResult(null);
    setEligibilityError(null);
  };

  const handleCheckEligibility = async (event: FormEvent) => {
    event.preventDefault();

    const payload: AvaliacaoPodeDoarPayload = {
      age: Number(age),
      weightKg: Number(weightKg),
      anemia,
      firstDonation,
      hadTattooOrPiercingRecently,
      hadFluOrFeverLast7Days,
      finishedAntibioticsLast7Days,
    };

    if (Number.isNaN(payload.age) || Number.isNaN(payload.weightKg)) {
      setEligibilityError("Preencha idade e peso com valores válidos.");
      setEligibilityResult(null);
      return;
    }

    try {
      setIsCheckingEligibility(true);
      setEligibilityError(null);
      const result = await avaliarPodeDoar(payload);
      setEligibilityResult(result);

      localStorage.setItem(
        "bloodlink_last_quiz_result",
        JSON.stringify({
          score,
          total: questions.length,
          checkedAt: new Date().toISOString(),
          payload,
          result,
        }),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível validar elegibilidade.";
      setEligibilityError(message);
      setEligibilityResult(null);
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  if (isFinished) {
    return (
      <div className="card page-grid">
        <header>
          <h1>Quiz concluido</h1>
          <p>
            Acertou <strong>{score}</strong> de <strong>{questions.length}</strong> perguntas.
          </p>
        </header>
        <p>
          {finalMessage}
        </p>
        <div>
          <button type="button" onClick={handleRestart}>
            Repetir quiz
          </button>
          <Link className="button button-secondary" to={exitPath} style={{ marginLeft: "0.75rem" }}>
            Sair do quiz
          </Link>
        </div>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>Verificar elegibilidade na API</h2>
          <p>Este formulário envia um pedido real para o endpoint POST /api/v1/pode-doar.</p>

          <form onSubmit={handleCheckEligibility} className="page-grid">
            <div className="form-group">
              <label htmlFor="quiz-age">Idade</label>
              <input
                id="quiz-age"
                type="number"
                min={0}
                value={age}
                onChange={(event) => setAge(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="quiz-weight">Peso (kg)</label>
              <input
                id="quiz-weight"
                type="number"
                min={0}
                step="0.1"
                value={weightKg}
                onChange={(event) => setWeightKg(event.target.value)}
              />
            </div>

            <label><input type="checkbox" checked={anemia} onChange={(event) => setAnemia(event.target.checked)} /> Tem anemia</label>
            <label><input type="checkbox" checked={firstDonation} onChange={(event) => setFirstDonation(event.target.checked)} /> Primeira dádiva</label>
            <label><input type="checkbox" checked={hadTattooOrPiercingRecently} onChange={(event) => setHadTattooOrPiercingRecently(event.target.checked)} /> Tatuagem/piercing recente</label>
            <label><input type="checkbox" checked={hadFluOrFeverLast7Days} onChange={(event) => setHadFluOrFeverLast7Days(event.target.checked)} /> Gripe/febre nos últimos 7 dias</label>
            <label><input type="checkbox" checked={finishedAntibioticsLast7Days} onChange={(event) => setFinishedAntibioticsLast7Days(event.target.checked)} /> Terminou antibiótico nos últimos 7 dias</label>

            <div>
              <button type="submit" disabled={isCheckingEligibility}>
                {isCheckingEligibility ? "A validar..." : "Validar na API"}
              </button>
            </div>
          </form>

          {eligibilityError && <p className="error-text">{eligibilityError}</p>}

          {eligibilityResult && (
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Resultado:</strong> {eligibilityResult.canDonate ? "Elegível" : "Não elegível"}
              </p>
              <p>{eligibilityResult.message}</p>
              {eligibilityResult.reasons.length > 0 && (
                <ul>
                  {eligibilityResult.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="card page-grid">
      <header>
        <h1>Quiz BloodLink</h1>
        <p>Teste rapido sobre doacao de sangue.</p>
        <div>
          <Link className="button button-secondary" to={exitPath}>
            Sair do quiz
          </Link>
        </div>
      </header>

      <div>
        <p>
          Pergunta <strong>{currentIndex + 1}</strong> de <strong>{questions.length}</strong>
        </p>
        <div aria-label="progresso" style={{ height: "10px", background: "rgba(17,19,24,0.1)", borderRadius: "999px" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              borderRadius: "999px",
              background: "linear-gradient(90deg, #7b1fa2, #d81b60)",
              transition: "width 200ms ease",
            }}
          />
        </div>
      </div>

      <section>
        <h2>{currentQuestion.prompt}</h2>
        <div className="page-grid" style={{ marginTop: "1rem" }}>
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = submitted && option.id === currentQuestion.correctOptionId;
            const isWrong = submitted && isSelected && option.id !== currentQuestion.correctOptionId;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedOptionId(option.id)}
                disabled={submitted}
                style={{
                  textAlign: "left",
                  border: "1px solid rgba(17,19,24,0.15)",
                  background: isCorrect
                    ? "rgba(46, 204, 113, 0.2)"
                    : isWrong
                      ? "rgba(231, 76, 60, 0.2)"
                      : isSelected
                        ? "rgba(123, 31, 162, 0.12)"
                        : "#fff",
                  color: "#111318",
                  borderRadius: "12px",
                  padding: "0.9rem 1rem",
                  boxShadow: "none",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      {submitted && currentQuestion && (
        <section className="card" style={{ padding: "1rem 1.2rem" }}>
          <p style={{ marginTop: 0 }}>
            {selectedOptionId === currentQuestion.correctOptionId ? "Resposta correta." : "Resposta incorreta."}
          </p>
          <p>
            <strong>Correta:</strong> {correctOption ? `${correctOption.id.toUpperCase()}) ${correctOption.label}` : "-"}
          </p>
          <p>
            <strong>A sua:</strong> {selectedOption ? `${selectedOption.id.toUpperCase()}) ${selectedOption.label}` : "-"}
          </p>
          <p style={{ marginBottom: 0 }}>{currentQuestion.explanation}</p>
        </section>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {!submitted ? (
          <button type="button" onClick={handleSubmitAnswer} disabled={!selectedOptionId}>
            Confirmar resposta
          </button>
        ) : (
          <button type="button" onClick={handleNext}>
            {currentIndex + 1 === questions.length ? "Ver resultado" : "Proxima pergunta"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
