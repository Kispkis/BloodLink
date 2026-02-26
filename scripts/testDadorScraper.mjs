import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.resolve(projectRoot, "tmp/dador_firebase_payload.json");

function isFresh(isoTimestamp, maxMinutes = 30) {
  if (!isoTimestamp) {
    return false;
  }

  const timestamp = new Date(isoTimestamp).getTime();

  if (Number.isNaN(timestamp)) {
    return false;
  }

  const ageMs = Date.now() - timestamp;
  return ageMs >= 0 && ageMs <= maxMinutes * 60 * 1000;
}

function runScraper() {
  console.log("▶️ A executar scraper...");

  const result = spawnSync("node", ["./scripts/dadorScraperToFirebase.mjs"], {
    cwd: projectRoot,
    encoding: "utf8",
    shell: true,
  });

  if (result.status === 0) {
    console.log("✅ Scraper executado sem erro de escrita no Firebase.");
    return;
  }

  const combinedOutput = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;

  if (combinedOutput.includes("PERMISSION_DENIED")) {
    console.log("ℹ️ Firebase bloqueou escrita (PERMISSION_DENIED), mas vou validar o JSON local.");
    return;
  }

  throw new Error("Scraper falhou por motivo diferente de PERMISSION_DENIED.");
}

function validateOutput() {
  if (!fs.existsSync(outputPath)) {
    throw new Error(`JSON local não encontrado em: ${outputPath}`);
  }

  const raw = fs.readFileSync(outputPath, "utf8");
  const data = JSON.parse(raw);

  const checks = {
    origem: data.origem === "https://dador.pt/sessoes",
    atualizado_em: isFresh(data.atualizado_em),
    metadata: typeof data.metadata === "object" && data.metadata !== null,
    postos_horarios: Array.isArray(data.postos_horarios) && data.postos_horarios.length > 0,
    postos_sessoes_horarios:
      Array.isArray(data.postos_sessoes_horarios) && data.postos_sessoes_horarios.length > 0,
    brigadas_moveis_horarios:
      Array.isArray(data.brigadas_moveis_horarios) && data.brigadas_moveis_horarios.length > 0,
    niveis_reservas: typeof data.niveis_reservas === "object" && data.niveis_reservas !== null,
  };

  const failed = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([name]) => name);

  if (failed.length > 0) {
    throw new Error(`Validação falhou nos campos: ${failed.join(", ")}`);
  }

  console.log("\n✅ TESTE DO SCRAPER PASSOU");
  console.log(
    JSON.stringify(
      {
        origem: data.origem,
        atualizado_em: data.atualizado_em,
        total_postos: data.metadata.total_postos,
        total_postos_sessoes: data.metadata.total_postos_sessoes,
        total_brigadas_moveis: data.metadata.total_brigadas_moveis,
      },
      null,
      2,
    ),
  );
}

try {
  runScraper();
  validateOutput();
} catch (error) {
  console.error("\n❌ TESTE DO SCRAPER FALHOU");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
