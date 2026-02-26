const fs = require('fs/promises');
const path = require('path');
const HttpError = require('../utils/httpError');

const DATA_DIR = path.join(__dirname, '..', 'data');

async function readJsonFile(fileName) {
  const filePath = path.join(DATA_DIR, fileName);

  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new HttpError(500, `Ficheiro de dados não encontrado: ${fileName}`);
    }

    throw new HttpError(500, `Falha a ler dados de ${fileName}`);
  }
}

module.exports = {
  readJsonFile,
};
