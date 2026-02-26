function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const response = {
    error: {
      message: err.message || 'Erro interno do servidor',
      code: statusCode,
    },
  };

  if (err.details) {
    response.error.details = err.details;
  }

  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error('[API][ERROR]', err);
  }

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;
