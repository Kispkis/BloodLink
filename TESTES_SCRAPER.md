# Testes do Scraper

## Objetivo
Validar unitariamente as funções principais do scraper em `scripts/dadorScraperToFirebase.mjs` sem depender de escrita no Firebase.

## Pré-requisitos
- Node.js instalado
- Dependências do projeto instaladas

## Como executar
1. Instalar dependências (se ainda não estiverem instaladas):
   - `npm install`
2. Executar os testes unitários do scraper:
   - `npm run test:unit:scraper`

## O que é testado
- Conversão de data (`DD-MM-YYYY` -> `YYYY-MM-DD`)
- Parse de coordenadas geográficas
- Parse de blocos de horário
- Transformação de reservas (`transformBloodReserves`)
- Transformação de instituições (`transformInstitutions`)
- Separação de sessões entre postos e brigadas móveis (`transformSessions`)

## Resultado esperado
- Sucesso: o comando termina com código `0` e mostra os testes como `ok`.
- Falha: o comando termina com código diferente de `0` e indica qual teste falhou.
