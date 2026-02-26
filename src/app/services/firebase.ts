import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const env = import.meta.env as Record<string, string | undefined>;

const readEnv = (key: string) => env[`VITE_${key}`] ?? env[key] ?? "";

const firebaseConfig = {
  apiKey: readEnv("FIREBASE_API_KEY"),
  authDomain: readEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: readEnv("FIREBASE_PROJECT_ID"),
  storageBucket: readEnv("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readEnv("FIREBASE_MESSAGING_SENDER_ID"),
  appId: readEnv("FIREBASE_APP_ID"),
};

const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "appId"] as const;

export const isFirebaseConfigured = requiredConfigKeys.every((key) => Boolean(firebaseConfig[key]));

if (!isFirebaseConfigured) {
  console.warn("Firebase config incompleto. Actualize o ficheiro .env.");
}

let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error("Falha a inicializar Firebase Auth.", error);
  }
}

export { auth };
export { firebaseConfig };
