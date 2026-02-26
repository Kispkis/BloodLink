const { readJsonFile } = require('./dataRepository');

async function listBrigadas() {
  const brigadas = await readJsonFile('brigadas.json');

  if (!Array.isArray(brigadas)) {
    return [];
  }

  return brigadas.map((brigada) => ({
    id: brigada.id,
    local: brigada.location,
    data: String(brigada.date || '').slice(0, 10),
    capacidade: 80,
    estado: 'Aberta',
  }));
}

module.exports = {
  listBrigadas,
};
