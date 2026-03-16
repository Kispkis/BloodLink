import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function loadEnvFile() {
  const envPath = path.join(projectRoot, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDJWS7pZs9K0A2GL0184dmEHSHbFAq_I6E",
  authDomain: "bloodlink-a0563.firebaseapp.com",
  databaseURL: "https://bloodlink-a0563-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bloodlink-a0563",
  storageBucket: "bloodlink-a0563.firebasestorage.app",
  messagingSenderId: "1077143009215",
  appId: "1:1077143009215:web:f7763f47551fe49f02130a",
  measurementId: "G-LZJ6DJ3RNR",
};

function readEnv(key, fallback = "") {
  return process.env[key] ?? process.env[`VITE_${key}`] ?? fallback;
}

const firebaseConfig = {
  apiKey: readEnv("FIREBASE_API_KEY", DEFAULT_FIREBASE_CONFIG.apiKey),
  authDomain: readEnv("FIREBASE_AUTH_DOMAIN", DEFAULT_FIREBASE_CONFIG.authDomain),
  databaseURL: readEnv("FIREBASE_DATABASE_URL", DEFAULT_FIREBASE_CONFIG.databaseURL),
  projectId: readEnv("FIREBASE_PROJECT_ID", DEFAULT_FIREBASE_CONFIG.projectId),
  storageBucket: readEnv("FIREBASE_STORAGE_BUCKET", DEFAULT_FIREBASE_CONFIG.storageBucket),
  messagingSenderId: readEnv("FIREBASE_MESSAGING_SENDER_ID", DEFAULT_FIREBASE_CONFIG.messagingSenderId),
  appId: readEnv("FIREBASE_APP_ID", DEFAULT_FIREBASE_CONFIG.appId),
  measurementId: readEnv("FIREBASE_MEASUREMENT_ID", DEFAULT_FIREBASE_CONFIG.measurementId),
};

const firebasePath = readEnv("FIREBASE_SCRAPER_PATH", "scraped/dador_pt");
const localOutputPath = readEnv("DADOR_SCRAPER_OUTPUT", "tmp/dador_firebase_payload.json");
const firebaseEmail = readEnv("FIREBASE_EMAIL", "");
const firebasePassword = readEnv("FIREBASE_PASSWORD", "");
const firebaseUseAnon = readEnv("FIREBASE_USE_ANON", "false").toLowerCase() === "true";

const API_URLS = {
  sessions: "https://dador.pt/api/sessions",
  institutions: "https://dador.pt/api/institutions",
  bloodReserves: "https://dador.pt/api/blood-reserves",
};

export function normalizeBloodType(value) {
  return String(value ?? "").replace(/\s+/g, "").toUpperCase();
}

export function normalizeDate(dateText) {
  if (!dateText) {
    return "";
  }

  const match = String(dateText).match(/^(\d{2})-(\d{2})-(\d{4})$/);

  if (!match) {
    return String(dateText);
  }

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

export function parseGeoReference(rawValue) {
  if (!rawValue || typeof rawValue !== "string") {
    return null;
  }

  const chunks = rawValue.split(",").map((piece) => piece.trim());

  if (chunks.length !== 2) {
    return null;
  }

  const lat = Number(chunks[0]);
  const lng = Number(chunks[1]);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return { lat, lng };
}

export function parseDailyTimeBlocks(scheduleText) {
  if (!scheduleText || typeof scheduleText !== "string") {
    return [];
  }

  const tokens = scheduleText.match(/\d{1,2}:\d{2}/g) ?? [];
  const blocks = [];

  for (let index = 0; index < tokens.length; index += 2) {
    const start = tokens[index];
    const end = tokens[index + 1];

    if (!start || !end) {
      continue;
    }

    blocks.push({ start, end });
  }

  return blocks;
}

export function mapBloodReserveEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      grupo: normalizeBloodType(item.ABO),
      nivel: String(item.Cor ?? "").toUpperCase(),
    }));
}

export function mapRegionalReserves(regionsRaw) {
  const mapped = {};

  if (!Array.isArray(regionsRaw)) {
    return mapped;
  }

  let currentRegion = "";

  for (const row of regionsRaw) {
    if (Array.isArray(row) && typeof row[0] === "string") {
      currentRegion = row[0].trim();
      mapped[currentRegion] = [];
      continue;
    }

    if (!currentRegion || !row || typeof row !== "object") {
      continue;
    }

    mapped[currentRegion].push({
      grupo: normalizeBloodType(row.ABO),
      nivel: String(row.Cor ?? "").toUpperCase(),
    });
  }

  return mapped;
}

export function transformBloodReserves(apiPayload) {
  const source = apiPayload?.data?.ReservasSangue ?? {};
  const sourceDate = source?.Data?.[0]?.[0] ?? "";

  return {
    data_referencia: sourceDate,
    versao: apiPayload?.data?.version ?? "",
    ipst: mapBloodReserveEntries(source?.IPST),
    nacional: mapBloodReserveEntries(source?.NACIONAL),
    regioes: mapRegionalReserves(source?.Regiao),
  };
}

export function transformInstitutions(apiPayload) {
  const institutions = apiPayload?.data?.CentrosColheita ?? [];

  return institutions.map((item) => ({
    id: item.Id,
    sigla: item.SiglaInstituicao,
    instituicao: item.DesInstituicao,
    distrito: item.DesDistrito,
    concelho: item.DesConcelho,
    morada: item.Morada,
    horario_texto: item.Horario,
    telefone: item.Telefone,
    email: item.Email,
    nuts2: item.CodNuts2,
    geo: parseGeoReference(item.GeoReferencia),
  }));
}

export function transformSessions(apiPayload) {
  const sessions = apiPayload?.data?.Sessoes ?? [];

  const normalized = sessions.map((item) => {
    const sessionType = String(item.DesTipoSessao ?? "").toUpperCase();

    return {
      id: item.Id,
      tipo_sessao: sessionType,
      codigo_tipo_sessao: item.CodTipoSessao,
      data: normalizeDate(item.DataBrigada),
      horarios: parseDailyTimeBlocks(item.HoraBrigada),
      horario_texto: item.HoraBrigada,
      local: item.Local,
      brigada: item.DesBrigada,
      instituicao: item.DesInstituicao,
      distrito: item.DesDistrito,
      concelho: item.DesConcelho,
      geo: parseGeoReference(item.GeoReferencia),
    };
  });

  const brigadasMoveis = normalized.filter((session) => {
    return session.tipo_sessao.includes("BRIGADA") || session.tipo_sessao.includes("UNIDADE MOVEL");
  });

  const postos = normalized.filter((session) => session.tipo_sessao.includes("POSTO"));

  return {
    brigadasMoveis,
    postos,
  };
}

export async function fetchJson(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Falha no fetch (${response.status}) em ${url}`);
  }

  const payload = await response.json();

  if (!payload?.success) {
    throw new Error(`Resposta inválida em ${url}: ${JSON.stringify(payload)}`);
  }

  return payload;
}

export async function run() {
  const [bloodReservesRaw, institutionsRaw, sessionsRaw] = await Promise.all([
    fetchJson(API_URLS.bloodReserves),
    fetchJson(API_URLS.institutions),
    fetchJson(API_URLS.sessions),
  ]);

  const bloodReserves = transformBloodReserves(bloodReservesRaw);
  const postosHorarios = transformInstitutions(institutionsRaw);
  const sessions = transformSessions(sessionsRaw);

  const payload = {
    origem: "https://dador.pt/sessoes",
    atualizado_em: new Date().toISOString(),
    metadata: {
      instituicoes_versao: institutionsRaw?.data?.version ?? "",
      reservas_versao: bloodReservesRaw?.data?.version ?? "",
      total_postos: postosHorarios.length,
      total_postos_sessoes: sessions.postos.length,
      total_brigadas_moveis: sessions.brigadasMoveis.length,
    },
    niveis_reservas: bloodReserves,
    postos_horarios: postosHorarios,
    postos_sessoes_horarios: sessions.postos,
    brigadas_moveis_horarios: sessions.brigadasMoveis,
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);

  const absoluteOutputPath = path.resolve(projectRoot, localOutputPath);
  const outputDirectory = path.dirname(absoluteOutputPath);

  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(absoluteOutputPath, JSON.stringify(payload, null, 2), "utf8");

  if (firebaseEmail && firebasePassword) {
    await signInWithEmailAndPassword(auth, firebaseEmail, firebasePassword);
  } else if (firebaseUseAnon) {
    await signInAnonymously(auth);
  }

  await set(ref(database, firebasePath), payload);

  console.log("✅ Scraper executado com sucesso.");
  console.log(`💾 Snapshot local: ${absoluteOutputPath}`);
  console.log(`📁 Caminho no Firebase: ${firebasePath}`);
  console.log(`🩸 Reservas IPST: ${payload.niveis_reservas.ipst.length}`);
  console.log(`🏥 Postos (instituições): ${payload.postos_horarios.length}`);
  console.log(`🚐 Brigadas móveis: ${payload.brigadas_moveis_horarios.length}`);
}

function isExecutedDirectly() {
  const entryFile = process.argv[1];

  if (!entryFile) {
    return false;
  }

  return path.resolve(entryFile) === __filename;
}

if (isExecutedDirectly()) {
  run().catch((error) => {
    const absoluteOutputPath = path.resolve(projectRoot, localOutputPath);

    console.error("❌ Erro ao executar scraper:");
    console.error(error);

    if (error?.code === "PERMISSION_DENIED") {
      console.error("\nℹ️ O JSON foi gerado localmente, mas o Firebase bloqueou escrita pelas regras atuais.");
      console.error(`   Ficheiro local: ${absoluteOutputPath}`);
      console.error("   Opcional: configure FIREBASE_EMAIL/FIREBASE_PASSWORD ou FIREBASE_USE_ANON=true no .env.");
    }

    process.exitCode = 1;
  });
}
