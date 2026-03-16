## feat: scraper dador.pt para Firebase (reservas, postos e brigadas móveis)

### Resumo
Implementa um scraper para `https://dador.pt/sessoes` (via endpoints públicos usados pelo site) e converte os dados para JSON estruturado, pronto para gravação no Firebase Realtime Database.

### O que foi adicionado
- Script `scripts/dadorScraperToFirebase.mjs`
  - Recolhe dados de:
    - `https://dador.pt/api/blood-reserves`
    - `https://dador.pt/api/institutions`
    - `https://dador.pt/api/sessions`
  - Normaliza e organiza em:
    - `niveis_reservas`
    - `postos_horarios`
    - `postos_sessoes_horarios`
    - `brigadas_moveis_horarios`
  - Escreve no Firebase em `FIREBASE_SCRAPER_PATH` (default: `scraped/dador_pt`)
  - Gera snapshot local em `tmp/dador_firebase_payload.json`

- Comando npm:
  - `npm run scrape:dador`

- Configuração e docs:
  - `.env.example` atualizado com variáveis de DB/path/autenticação opcional
  - `README.md` com instruções de uso do scraper

- Higiene de repo:
  - `tmp/` ignorado no `.gitignore`

### Nota de execução
A recolha e transformação funcionam corretamente. A escrita no Firebase pode falhar com `PERMISSION_DENIED` se as regras do Realtime Database não permitirem escrita para o utilizador atual.

### Como testar
1. `npm install`
2. Configurar `.env` (Firebase + path)
3. `npm run scrape:dador`
4. Verificar:
   - snapshot local em `tmp/dador_firebase_payload.json`
   - nó no RTDB em `scraped/dador_pt` (se regras permitirem)
