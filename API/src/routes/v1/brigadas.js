const express = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const { listBrigadas } = require('../../repositories/brigadasRepository');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const brigadas = await listBrigadas();
    res.json(brigadas);
  }),
);

module.exports = router;
