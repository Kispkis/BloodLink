import { useCallback } from "react";
import {
  getBrigadas,
  getElegibilidade,
  getReservas,
} from "../services/api";

export const useApi = () => {
  const fetchReservas = useCallback(() => getReservas(), []);
  const fetchBrigadas = useCallback(() => getBrigadas(), []);
  const fetchElegibilidade = useCallback(() => getElegibilidade(), []);

  return {
    fetchReservas,
    fetchBrigadas,
    fetchElegibilidade,
  };
};
