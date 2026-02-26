function notFound(req, res) {
  return res.status(404).json({
    error: {
      code: 404,
      message: `Endpoint não encontrado: ${req.method} ${req.originalUrl}`,
    },
  });
}

module.exports = notFound;
