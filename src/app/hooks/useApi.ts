import { useCallback } from "react";
import {
  getBrigadas,
  getElegibilidade,
  getPostos,
  getReservas,
} from "../services/api";

export const useApi = () => {
  const fetchReservas = useCallback(() => getReservas(), []);
  const fetchPostos = useCallback(() => getPostos(), []);
  const fetchBrigadas = useCallback(() => getBrigadas(), []);
  const fetchElegibilidade = useCallback(() => getElegibilidade(), []);

  return {
    fetchReservas,
    fetchPostos,
    fetchBrigadas,
    fetchElegibilidade,
  };
};
