# BloodLink API (mock)

Pequena API Node.js + Express para o projeto BloodLink — implementação de protótipo com dados mock.

Instalação e execução

```powershell
cd c:\Users\Admin\Desktop\API
npm install
npm start
```

Depois de arrancar, aceda à API em: http://localhost:3030 (ou em `http://localhost:$PORT` se alterar a variável de ambiente `PORT`).

Endpoints principais

- `GET /reservas`
- `GET /postos`
- `GET /brigadas`
- `POST /pode-doar` (validação rápida de elegibilidade)
 

Notas

- Os dados em `src/data` são mock e simulam a saída do scraper.
- Para desenvolvimento use `npm run dev` (nodemon).

Teste rápido do `POST /pode-doar`

Exemplo `curl`:

```powershell
curl -X POST http://localhost:3030/pode-doar -H "Content-Type: application/json" -d "{\"age\":25,\"weightKg\":70,\"anemia\":false,\"recentTravel\":false,\"medication\":false,\"vaccinationDaysAgo\":30,\"fever\":false,\"tattooOrPiercingInLast4Months\":false,\"pregnantOrBreastfeeding\":false}"
```

Se aceder via browser a `http://localhost:3030/pode-doar` verá uma explicação e um exemplo de payload (o endpoint principal aceita apenas POST com JSON).
