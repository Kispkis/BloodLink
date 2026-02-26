import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { getUserProfile, setUserProfile, type UserProfile } from "../services/profileStore";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; profile: UserProfile }) => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);

        if (currentUser) {
          setProfile(getUserProfile(currentUser.uid));
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      },
      (error) => {
        console.error("Erro ao validar sessao.", error);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Autenticacao indisponivel. Configure o Firebase (.env). ");
    }
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const register = useCallback(async (data: { email: string; password: string; profile: UserProfile }) => {
    if (!auth) {
      throw new Error("Autenticacao indisponivel. Configure o Firebase (.env). ");
    }

    const email = data.email.trim();
    const { password, profile } = data;

    const credential = await createUserWithEmailAndPassword(auth, email, password);

    if (profile.fullName) {
      await updateProfile(credential.user, { displayName: profile.fullName });
    }

    setUserProfile(credential.user.uid, profile);
    setProfile(profile);
  }, []);

  const updateUserProfile = useCallback(async (nextProfile: UserProfile) => {
    if (!auth) {
      throw new Error("Autenticacao indisponivel. Configure o Firebase (.env). ");
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Sem sessao activa.");
    }

    if (nextProfile.fullName && nextProfile.fullName !== currentUser.displayName) {
      await updateProfile(currentUser, { displayName: nextProfile.fullName });
    }

    setUserProfile(currentUser.uid, nextProfile);
    setProfile(nextProfile);
  }, []);

  const logout = useCallback(async () => {
    if (!auth) {
      return;
    }
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      updateUserProfile,
      logout,
    }),
    [user, profile, isLoading, login, register, updateUserProfile, logout],
  );

  return createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
