const express = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const { listPostos } = require('../../repositories/postosRepository');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const postos = await listPostos();
    res.json(postos);
  }),
);

module.exports = router;
