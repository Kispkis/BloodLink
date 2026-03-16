import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

if (!firebaseConfig.apiKey) {
  console.warn("Firebase config incompleto. Actualize o ficheiro .env.");
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export { firebaseConfig };
