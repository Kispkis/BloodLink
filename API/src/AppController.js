module.exports = {
  // Método para a rota raiz
  async index(req, res) {
    return res.json({
      project: 'BloodLink',
      version: '1.0.0',
      message: 'Bem-vindo à API do BloodLink. Juntos salvamos vidas.'
    });
  },

  // Método para verificar se a API está online
  async status(req, res) {
    return res.json({
      status: 'online',
      timestamp: new Date().toISOString()
    });
  }
};