const express = require('express');
const reservasRoute = require('./reservas');
const postosRoute = require('./postos');
const brigadasRoute = require('./brigadas');
const podeDoarRoute = require('./pode-doar');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    service: 'BloodLink API',
    version: 'v1',
    status: 'ok',
  });
});

router.get('/status', (_req, res) => {
  res.json({
    status: 'online',
    version: 'v1',
    timestamp: new Date().toISOString(),
  });
});

router.use('/reservas', reservasRoute);
router.use('/postos', postosRoute);
router.use('/brigadas', brigadasRoute);
router.use('/pode-doar', podeDoarRoute);

module.exports = router;
