export interface Reserva {
  id: string;
  tipo: string;
  quantidade: number;
  data: string;
  estado: "Confirmada" | "Pendente" | "Cancelada";
}

export interface Posto {
  id: string;
  nome: string;
  cidade: string;
  horario: string;
  contacto: string;
}

export interface Brigada {
  id: string;
  local: string;
  data: string;
  capacidade: number;
  estado: "Aberta" | "Lotada";
}

export interface Elegibilidade {
  ultimoAgendamento: string;
  podeDoar: boolean;
  recomendacao: string;
}

export interface AvaliacaoPodeDoarPayload {
  age: number;
  weightKg: number;
  anemia: boolean;
  firstDonation: boolean;
  hadTattooOrPiercingRecently: boolean;
  hadFluOrFeverLast7Days: boolean;
  finishedAntibioticsLast7Days: boolean;
}

export interface AvaliacaoPodeDoarResponse {
  canDonate: boolean;
  reasons: string[];
  message: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api/v1";

const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const fallback = `Falha ao carregar ${path} (${response.status}).`;

    try {
      const body = (await response.json()) as { error?: { message?: string } };
      throw new Error(body.error?.message || fallback);
    } catch {
      throw new Error(fallback);
    }
  }

  return (await response.json()) as T;
};

export const getReservas = async (): Promise<Reserva[]> => {
  const reservas = await requestJson<Reserva[]>("/reservas");
  return reservas;
};

export const getPostos = async (): Promise<Posto[]> => {
  const postos = await requestJson<Posto[]>("/postos");
  return postos;
};

export const getBrigadas = async (): Promise<Brigada[]> => {
  const brigadas = await requestJson<Brigada[]>("/brigadas");
  return brigadas;
};

type ElegibilidadeApiResponse = {
  ultimoAgendamento?: string;
  podeDoar?: boolean;
  recomendacao?: string;
};

export const getElegibilidade = async (): Promise<Elegibilidade> => {
  const data = await requestJson<ElegibilidadeApiResponse>("/pode-doar/info");

  return {
    ultimoAgendamento: data.ultimoAgendamento ?? "-",
    podeDoar: Boolean(data.podeDoar),
    recomendacao: data.recomendacao ?? "Informação indisponível.",
  };
};

export const avaliarPodeDoar = async (
  payload: AvaliacaoPodeDoarPayload,
): Promise<AvaliacaoPodeDoarResponse> => {
  return requestJson<AvaliacaoPodeDoarResponse>("/pode-doar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
