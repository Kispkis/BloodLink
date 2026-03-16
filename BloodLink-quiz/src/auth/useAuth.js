import { createContext, createElement, useCallback, useContext, useMemo, useState } from "react";
import { postLogin, postRegisto } from "../api/user";

const TOKEN_KEY = "bloodlink_token";
const USER_KEY = "bloodlink_user";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const persistSession = useCallback((nextToken, user = null) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);

    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setCurrentUser(user);
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setCurrentUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await postLogin({ email, password });
    if (!response?.token) {
      throw new Error("Falha na autenticacao.");
    }

    persistSession(response.token, response.user ?? { email });
    return response;
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    const response = await postRegisto(payload);

    if (response?.token) {
      persistSession(response.token, response.user ?? { email: payload.email });
    }

    return response;
  }, [persistSession]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const isAuthenticated = useCallback(() => Boolean(token), [token]);
  const getToken = useCallback(() => token || localStorage.getItem(TOKEN_KEY), [token]);

  const value = useMemo(() => ({
    token,
    user: currentUser,
    login,
    register,
    logout,
    isAuthenticated,
    getToken,
  }), [token, currentUser, login, register, logout, isAuthenticated, getToken]);

  return createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
};
