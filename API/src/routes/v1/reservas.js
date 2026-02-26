const express = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const { listReservas } = require('../../repositories/reservasRepository');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const reservas = await listReservas();
    res.json(reservas);
  }),
);

module.exports = router;
