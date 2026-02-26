const { readJsonFile } = require('./dataRepository');

function extractCity(address = '') {
  const parts = String(address).split(',').map((chunk) => chunk.trim()).filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : 'N/D';
}

async function listPostos() {
  const postos = await readJsonFile('postos.json');

  if (!Array.isArray(postos)) {
    return [];
  }

  return postos.map((posto) => ({
    id: posto.id,
    nome: posto.name,
    cidade: extractCity(posto.address),
    horario: posto.hours || 'N/D',
    contacto: posto.phone || posto.email || 'N/D',
  }));
}

module.exports = {
  listPostos,
};
