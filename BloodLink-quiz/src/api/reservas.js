import { fetchPublic } from "./user";

export const getReservasPublicas = async () =>
  fetchPublic("/reservas", [
    { id: "RS-2026-01", tipo: "O+", quantidade: 42, nivel: "Estavel", data: "2026-02-26", estado: "Confirmada", local: "Centro Regional Norte — Porto" },
    { id: "RS-2026-02", tipo: "O-", quantidade: 8, nivel: "Critico", data: "2026-02-26", estado: "Confirmada", local: "IPST Lisboa" },
    { id: "RS-2026-03", tipo: "A+", quantidade: 35, nivel: "Estavel", data: "2026-02-25", estado: "Confirmada", local: "Hospital Santa Maria — Lisboa" },
    { id: "RS-2026-04", tipo: "A-", quantidade: 5, nivel: "Baixo", data: "2026-02-25", estado: "Pendente", local: "Centro Hospitalar de Coimbra" },
    { id: "RS-2026-05", tipo: "B+", quantidade: 18, nivel: "Adequado", data: "2026-02-24", estado: "Confirmada", local: "Hospital Sao Joao — Porto" },
    { id: "RS-2026-06", tipo: "B-", quantidade: 3, nivel: "Critico", data: "2026-02-24", estado: "Pendente", local: "IPST Coimbra" },
    { id: "RS-2026-07", tipo: "AB+", quantidade: 12, nivel: "Adequado", data: "2026-02-23", estado: "Confirmada", local: "Hospital Garcia de Orta — Almada" },
    { id: "RS-2026-08", tipo: "AB-", quantidade: 2, nivel: "Critico", data: "2026-02-23", estado: "Cancelada", local: "Centro Hospitalar do Algarve — Faro" },
  ]);
