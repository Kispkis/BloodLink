const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const buildHeaders = (token) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const safeFetch = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (response.status === 401) {
    const authError = new Error("Token invalido ou expirado.");
    authError.code = "UNAUTHORIZED";
    throw authError;
  }

  if (!response.ok) {
    throw new Error(`Pedido falhou (${response.status}) em ${path}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const fetchPublic = async (path, fallbackData) => {
  try {
    return await safeFetch(path, { method: "GET" });
  } catch {
    return fallbackData;
  }
};

export const fetchPrivate = async (path, token, fallbackData) => {
  try {
    return await safeFetch(path, {
      method: "GET",
      headers: buildHeaders(token),
    });
  } catch (error) {
    if (error?.code === "UNAUTHORIZED") {
      throw error;
    }

    return fallbackData;
  }
};

export const postLogin = async ({ email, password }) => {
  try {
    return await safeFetch("/login", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ email: email?.trim(), password }),
    });
  } catch {
    if (!email || !password) {
      throw new Error("Credenciais invalidas.");
    }

    return {
      token: "mock-token-bloodlink",
      user: { email: email.trim(), fullName: "Utilizador BloodLink" },
    };
  }
};

export const postRegisto = async (payload) => {
  try {
    return await safeFetch("/registo", {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      token: "mock-token-bloodlink",
      user: {
        email: payload.email?.trim(),
        fullName: payload.profile?.fullName,
      },
    };
  }
};

export const getPerfil = async (token) =>
  fetchPrivate("/perfil", token, {
    nome: "Maria Isabel Castro",
    email: "maria.castro@bloodlink.pt",
    dataNascimento: "1991-06-14",
    telefone: "+351 912 345 678",
    grupoSanguineo: "O+",
    genero: "Feminino",
    peso: 62,
    morada: "Rua das Flores 45, 4000-262 Porto",
    concelho: "Porto",
    distrito: "Porto",
    numeroUtente: "123456789",
    totalDoacoes: 7,
    ultimaDoacao: "2025-11-10",
    proximaDoacaoPermitida: "2026-01-05",
    preferencias: {
      notificacoesEmail: true,
      notificacoesPush: true,
      lembreteDoacoes: true,
      campanhasProximas: true,
    },
    dataCriacao: "2023-03-20",
  });

export const getHistorico = async (token) =>
  fetchPrivate("/historico", token, [
    { id: "HD-001", data: "2025-11-10", local: "Centro Regional Norte — Porto", tipo: "Sangue total", volume: 450, resultado: "Aceite", observacoes: "Sem intercorrencias" },
    { id: "HD-002", data: "2025-07-02", local: "Hospital Santa Maria — Lisboa", tipo: "Plasma", volume: 600, resultado: "Aceite", observacoes: "Aferese sem complicacoes" },
    { id: "HD-003", data: "2025-03-18", local: "Brigada UMinho — Braga", tipo: "Sangue total", volume: 450, resultado: "Aceite", observacoes: null },
    { id: "HD-004", data: "2024-11-25", local: "IPST Lisboa", tipo: "Sangue total", volume: 450, resultado: "Aceite", observacoes: "Ligeira hipotensao pos-doacao, resolvida apos repouso" },
    { id: "HD-005", data: "2024-08-10", local: "Centro de Sangue de Coimbra", tipo: "Sangue total", volume: 450, resultado: "Aceite", observacoes: null },
    { id: "HD-006", data: "2024-04-22", local: "Hospital Sao Joao — Porto", tipo: "Plaquetas", volume: 300, resultado: "Aceite", observacoes: "Aferese de plaquetas, duracao 50 min" },
    { id: "HD-007", data: "2023-12-05", local: "Centro Regional Norte — Porto", tipo: "Sangue total", volume: 450, resultado: "Recusada", observacoes: "Hemoglobina abaixo do limite minimo (11.8 g/dL)" },
  ]);

export const getGamificacao = async (token) =>
  fetchPrivate("/gamificacao", token, {
    pontos: 1280,
    nivel: "Dador Prata",
    proximoNivel: "Dador Ouro",
    pontosProximoNivel: 2000,
    medalhas: [
      { id: "M01", nome: "Primeira Doacao", descricao: "Realizou a primeira doacao de sangue", dataConquista: "2023-03-20", icone: "drop" },
      { id: "M02", nome: "Dador Regular", descricao: "Completou 3 doacoes em 12 meses", dataConquista: "2024-04-22", icone: "calendar-check" },
      { id: "M03", nome: "Impacto Comunitario", descricao: "Participou em 2 brigadas moveis", dataConquista: "2025-03-18", icone: "users" },
      { id: "M04", nome: "Quiz Master", descricao: "Respondeu corretamente a todas as perguntas do quiz", dataConquista: "2025-07-15", icone: "brain" },
      { id: "M05", nome: "Educador", descricao: "Partilhou conteudo educativo 5 vezes", dataConquista: "2025-09-01", icone: "share" },
    ],
    ranking: {
      posicao: 42,
      totalUtilizadores: 1350,
      percentilSuperior: 97,
    },
    proximaMeta: "Atingir 2000 pontos para desbloquear nivel Ouro e a medalha Heroi Dourado",
  });

export const getNotificacoesPersonalizadas = async (token) =>
  fetchPrivate("/notificacoes-personalizadas", token, [
    { id: "N01", tipo: "campanha", titulo: "Nova brigada perto de si", mensagem: "Ha uma nova brigada de recolha na Universidade do Minho a 28/02. Inscreva-se!", data: "2026-02-15", lida: false },
    { id: "N02", tipo: "lembrete", titulo: "Pode voltar a doar", mensagem: "Ja passaram 56 dias desde a sua ultima doacao. Agende a proxima!", data: "2026-01-05", lida: false },
    { id: "N03", tipo: "alerta", titulo: "Reservas criticas de O-", mensagem: "As reservas de sangue O- estao em nivel critico na zona Norte. A sua doacao pode salvar vidas.", data: "2026-02-20", lida: false },
    { id: "N04", tipo: "conquista", titulo: "Nova medalha desbloqueada!", mensagem: "Parabens! Conquistou a medalha 'Educador' por partilhar conteudo educativo.", data: "2025-09-01", lida: true },
    { id: "N05", tipo: "sistema", titulo: "Atualizacao de perfil", mensagem: "Os seus dados de contacto foram atualizados com sucesso.", data: "2025-08-20", lida: true },
    { id: "N06", tipo: "campanha", titulo: "Dia Mundial do Dador de Sangue", mensagem: "No dia 14 de junho celebra-se o Dia Mundial do Dador. Participe nas atividades especiais!", data: "2025-06-10", lida: true },
  ]);
