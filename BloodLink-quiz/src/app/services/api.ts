export interface Reserva {
  id: string;
  tipo: string;
  quantidade: number;
  nivel: "Critico" | "Baixo" | "Adequado" | "Estavel";
  data: string;
  estado: "Confirmada" | "Pendente" | "Cancelada";
  local: string;
}

export interface Brigada {
  id: string;
  local: string;
  data: string;
  horario: string;
  capacidade: number;
  inscritos: number;
  estado: "Aberta" | "Lotada";
}

export interface Elegibilidade {
  ultimoAgendamento: string;
  podeDoar: boolean;
  proximaDataPermitida: string;
  restricoes: string[];
  recomendacao: string;
}

export const getReservas = async (): Promise<Reserva[]> => {
  return [
    { id: "RS-2026-01", tipo: "O+", quantidade: 42, nivel: "Estavel", data: "2026-02-26", estado: "Confirmada", local: "Centro Regional Norte — Porto" },
    { id: "RS-2026-02", tipo: "O-", quantidade: 8, nivel: "Critico", data: "2026-02-26", estado: "Confirmada", local: "IPST Lisboa" },
    { id: "RS-2026-03", tipo: "A+", quantidade: 35, nivel: "Estavel", data: "2026-02-25", estado: "Confirmada", local: "Hospital Santa Maria — Lisboa" },
    { id: "RS-2026-04", tipo: "A-", quantidade: 5, nivel: "Baixo", data: "2026-02-25", estado: "Pendente", local: "Centro Hospitalar de Coimbra" },
    { id: "RS-2026-05", tipo: "B+", quantidade: 18, nivel: "Adequado", data: "2026-02-24", estado: "Confirmada", local: "Hospital Sao Joao — Porto" },
    { id: "RS-2026-06", tipo: "B-", quantidade: 3, nivel: "Critico", data: "2026-02-24", estado: "Pendente", local: "IPST Coimbra" },
    { id: "RS-2026-07", tipo: "AB+", quantidade: 12, nivel: "Adequado", data: "2026-02-23", estado: "Confirmada", local: "Hospital Garcia de Orta — Almada" },
    { id: "RS-2026-08", tipo: "AB-", quantidade: 2, nivel: "Critico", data: "2026-02-23", estado: "Cancelada", local: "Centro Hospitalar do Algarve — Faro" },
  ];
};

export const getBrigadas = async (): Promise<Brigada[]> => {
  return [
    { id: "BG-01", local: "Universidade do Minho — Braga", data: "2026-02-28", horario: "09:00 - 17:00", capacidade: 80, inscritos: 34, estado: "Aberta" },
    { id: "BG-02", local: "Praca do Comercio — Lisboa", data: "2026-03-05", horario: "10:00 - 18:00", capacidade: 120, inscritos: 120, estado: "Lotada" },
    { id: "BG-03", local: "Forum de Aveiro — Aveiro", data: "2026-03-08", horario: "08:30 - 16:30", capacidade: 60, inscritos: 12, estado: "Aberta" },
    { id: "BG-04", local: "Universidade de Coimbra — Coimbra", data: "2026-03-12", horario: "09:00 - 15:00", capacidade: 100, inscritos: 67, estado: "Aberta" },
    { id: "BG-05", local: "Centro Comercial NorteShopping — Porto", data: "2026-03-15", horario: "10:00 - 19:00", capacidade: 150, inscritos: 150, estado: "Lotada" },
    { id: "BG-06", local: "Parque das Nacoes — Lisboa", data: "2026-03-20", horario: "08:00 - 14:00", capacidade: 90, inscritos: 45, estado: "Aberta" },
    { id: "BG-07", local: "Universidade do Algarve — Faro", data: "2026-03-22", horario: "09:30 - 16:00", capacidade: 50, inscritos: 8, estado: "Aberta" },
    { id: "BG-08", local: "Mercado Municipal de Leiria — Leiria", data: "2026-03-25", horario: "10:00 - 17:00", capacidade: 70, inscritos: 0, estado: "Aberta" },
  ];
};

export const getElegibilidade = async (): Promise<Elegibilidade> => {
  return {
    ultimoAgendamento: "2025-11-10",
    podeDoar: true,
    proximaDataPermitida: "2026-01-05",
    restricoes: [],
    recomendacao: "Elegivel para nova doacao. Ja passaram mais de 56 dias desde a ultima colheita. Pode agendar na brigada ou posto mais proximo.",
  };
};
