import { fetchPublic } from "./user";

export const getBrigadasPublicas = async () =>
  fetchPublic("/brigadas", [
    { id: "BG-01", local: "Universidade do Minho — Braga", data: "2026-02-28", horario: "09:00 - 17:00", capacidade: 80, inscritos: 34, estado: "Aberta" },
    { id: "BG-02", local: "Praca do Comercio — Lisboa", data: "2026-03-05", horario: "10:00 - 18:00", capacidade: 120, inscritos: 120, estado: "Lotada" },
    { id: "BG-03", local: "Forum de Aveiro — Aveiro", data: "2026-03-08", horario: "08:30 - 16:30", capacidade: 60, inscritos: 12, estado: "Aberta" },
    { id: "BG-04", local: "Universidade de Coimbra — Coimbra", data: "2026-03-12", horario: "09:00 - 15:00", capacidade: 100, inscritos: 67, estado: "Aberta" },
    { id: "BG-05", local: "Centro Comercial NorteShopping — Porto", data: "2026-03-15", horario: "10:00 - 19:00", capacidade: 150, inscritos: 150, estado: "Lotada" },
    { id: "BG-06", local: "Parque das Nacoes — Lisboa", data: "2026-03-20", horario: "08:00 - 14:00", capacidade: 90, inscritos: 45, estado: "Aberta" },
    { id: "BG-07", local: "Universidade do Algarve — Faro", data: "2026-03-22", horario: "09:30 - 16:00", capacidade: 50, inscritos: 8, estado: "Aberta" },
    { id: "BG-08", local: "Mercado Municipal de Leiria — Leiria", data: "2026-03-25", horario: "10:00 - 17:00", capacidade: 70, inscritos: 0, estado: "Aberta" },
  ]);
