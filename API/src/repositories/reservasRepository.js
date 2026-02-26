const { readJsonFile } = require('./dataRepository');

async function listReservas() {
  const dataset = await readJsonFile('reservas.json');

  if (!Array.isArray(dataset.levels)) {
    return [];
  }

  return dataset.levels.map((level, index) => {
    const quantidade = Number(level.units || 0);
    const estado = quantidade >= 80 ? 'Confirmada' : quantidade >= 30 ? 'Pendente' : 'Cancelada';

    return {
      id: `RS-${String(index + 1).padStart(3, '0')}`,
      tipo: level.type,
      quantidade,
      data: (dataset.updatedAt || '').slice(0, 10) || new Date().toISOString().slice(0, 10),
      estado,
    };
  });
}

module.exports = {
  listReservas,
};
