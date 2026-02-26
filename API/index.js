require('dotenv').config();
const express = require('express');
const cors = require('cors');
const v1Routes = require('./src/routes/v1');
const notFound = require('./src/middleware/notFound');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3030;

// Middleware para permitir parsing de JSON no corpo das requisições
app.use(cors());
app.use(express.json());

// Log para ver os pedidos a chegar no terminal
app.use((req, res, next) => {
  console.log(`[API] ${new Date().toLocaleTimeString()} - Pedido recebido: ${req.method} ${req.url}`);
  next();
});

// Rotas versionadas
app.use('/api/v1', v1Routes);

// Compatibilidade temporária sem versão
app.use('/reservas', (req, _res, next) => {
  req.url = `/reservas${req.url === '/' ? '' : req.url}`;
  next();
}, v1Routes);
app.use('/postos', (req, _res, next) => {
  req.url = `/postos${req.url === '/' ? '' : req.url}`;
  next();
}, v1Routes);
app.use('/brigadas', (req, _res, next) => {
  req.url = `/brigadas${req.url === '/' ? '' : req.url}`;
  next();
}, v1Routes);
app.use('/pode-doar', (req, _res, next) => {
  req.url = `/pode-doar${req.url === '/' ? '' : req.url}`;
  next();
}, v1Routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n=== BloodLink API ===`);
  console.log(`Estado: Rodando na porta ${PORT}`);
  console.log(`Endereço: http://localhost:${PORT}`);
  console.log(`Rotas disponíveis: /api/v1/reservas, /api/v1/postos, /api/v1/brigadas, /api/v1/pode-doar/info, /api/v1/pode-doar`);
  console.log(`=====================\n`);
});