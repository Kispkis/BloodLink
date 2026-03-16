import { fetchPublic } from "./user";

export const getQuizPublico = async () =>
  fetchPublic("/quiz", {
    perguntas: [
      {
        id: 1,
        texto: "Qual e a idade minima para doar sangue em Portugal sem consentimento dos pais?",
        opcoes: ["16 anos", "17 anos", "18 anos", "21 anos"],
        correta: 2,
        explicacao: "Sem consentimento dos pais, a idade minima para doar sangue e 18 anos. Com autorizacao parental, e possivel doar a partir dos 17 anos. A idade maxima e 65 (ou 70 para dadores regulares com autorizacao medica).",
      },
      {
        id: 2,
        texto: "Qual e o peso minimo exigido para poder doar sangue?",
        opcoes: ["40 kg", "45 kg", "50 kg", "55 kg"],
        correta: 2,
        explicacao: "O peso minimo e de 50 kg. Abaixo deste valor o volume colhido pode representar risco para o dador.",
      },
      {
        id: 3,
        texto: "Qual e o intervalo minimo entre duas doacoes de sangue total?",
        opcoes: ["30 dias", "45 dias", "56 dias", "90 dias"],
        correta: 2,
        explicacao: "O intervalo minimo entre doacoes de sangue total e de 56 dias (8 semanas) para permitir a recuperacao completa do organismo.",
      },
      {
        id: 4,
        texto: "Quantas vidas pode salvar uma unica doacao de sangue?",
        opcoes: ["1 vida", "Ate 3 vidas", "Ate 5 vidas", "Ate 10 vidas"],
        correta: 1,
        explicacao: "Uma unica doacao pode ser separada em globulos vermelhos, plasma e plaquetas, salvando ate 3 vidas diferentes.",
      },
      {
        id: 5,
        texto: "Qual e o tipo sanguineo considerado 'dador universal'?",
        opcoes: ["A+", "AB+", "O-", "B-"],
        correta: 2,
        explicacao: "O tipo O- e o dador universal porque os seus globulos vermelhos podem ser transfundidos a qualquer pessoa, independentemente do tipo sanguíneo.",
      },
      {
        id: 6,
        texto: "Quanto tempo dura, em media, a colheita de sangue total?",
        opcoes: ["2 a 5 minutos", "8 a 12 minutos", "20 a 30 minutos", "45 a 60 minutos"],
        correta: 1,
        explicacao: "A colheita de sangue total demora entre 8 a 12 minutos. Todo o processo (registo, triagem, colheita e repouso) pode durar cerca de 45 minutos.",
      },
      {
        id: 7,
        texto: "Qual e o volume aproximado de sangue recolhido por doacao?",
        opcoes: ["200 ml", "350 ml", "450 ml", "600 ml"],
        correta: 2,
        explicacao: "Sao recolhidos aproximadamente 450 ml de sangue por doacao, o que corresponde a menos de 10% do volume total de sangue de um adulto.",
      },
      {
        id: 8,
        texto: "Apos fazer uma tatuagem, quanto tempo deve esperar para doar?",
        opcoes: ["1 mes", "2 meses", "4 meses", "12 meses"],
        correta: 2,
        explicacao: "Deve aguardar 4 meses apos uma tatuagem ou piercing, devido ao risco de infecoes durante o periodo de janela imunologica.",
      },
      {
        id: 9,
        texto: "Qual e a validade dos globulos vermelhos apos a colheita?",
        opcoes: ["5 dias", "14 dias", "42 dias", "6 meses"],
        correta: 2,
        explicacao: "Os globulos vermelhos conservados duram apenas 42 dias. E por isso que a doacao regular e tao importante para manter as reservas.",
      },
      {
        id: 10,
        texto: "Quantas doacoes de sangue sao necessarias por dia em Portugal?",
        opcoes: ["Cerca de 200", "Cerca de 500", "Cerca de 1.000", "Cerca de 5.000"],
        correta: 2,
        explicacao: "Portugal precisa de cerca de 1.000 doacoes por dia para manter as reservas estaveis e garantir a seguranca transfusional.",
      },
    ],
  });

export const getEducacaoPublica = async () =>
  fetchPublic("/educacao", [
    { id: 1, titulo: "Antes da doacao", topicos: [
      "Beba pelo menos 500 ml de agua nas 2 horas anteriores.",
      "Faca uma refeicao ligeira — evite gorduras e lacticinios em excesso.",
      "Durma bem na noite anterior (minimo 6 horas).",
      "Evite bebidas alcoolicas nas 24 horas anteriores.",
      "Leve um documento de identificacao com foto.",
    ]},
    { id: 2, titulo: "Durante a doacao", topicos: [
      "A colheita demora entre 8 a 12 minutos para sangue total.",
      "Respire normalmente e mantenha-se relaxado(a).",
      "Informe o tecnico se sentir tonturas, nauseas ou suores frios.",
      "O volume recolhido e de aproximadamente 450 ml.",
    ]},
    { id: 3, titulo: "Depois da doacao", topicos: [
      "Descanse 10 a 15 minutos no local antes de sair.",
      "Beba liquidos em abundancia nas proximas 24 horas.",
      "Evite esforco fisico intenso e carregar pesos no dia da doacao.",
      "Nao fume durante pelo menos 2 horas apos a doacao.",
      "Mantenha o penso no braco durante 2 a 3 horas.",
      "Se sentir tonturas, deite-se e eleve as pernas.",
    ]},
    { id: 4, titulo: "Factos sobre doacao de sangue", topicos: [
      "Uma unica doacao pode salvar ate 3 vidas.",
      "O sangue nao pode ser fabricado — so pode vir de dadores voluntarios.",
      "Portugal precisa de cerca de 1.000 doacoes por dia para manter reservas estaveis.",
      "Os globulos vermelhos duram apenas 42 dias apos a colheita.",
      "As plaquetas tem validade de apenas 5 dias.",
      "O tipo sanguineo O- e o dador universal, mas so 7% da populacao o tem.",
    ]},
  ]);
