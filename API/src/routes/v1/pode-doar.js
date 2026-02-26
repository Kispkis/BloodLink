const express = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const { validatePodeDoarPayload } = require('../../validators/podeDoarValidator');
const { getEligibilityInfo, evaluateDonationEligibility } = require('../../services/elegibilidadeService');

const router = express.Router();

router.get('/info', (_req, res) => {
  res.json(getEligibilityInfo());
});

router.get('/', (_req, res) => {
  res.json({
    message: 'Use GET /pode-doar/info para informação e POST /pode-doar para avaliação.',
  });
});

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const payload = validatePodeDoarPayload(req.body);
    const result = evaluateDonationEligibility(payload);
    res.json(result);
  }),
);

module.exports = router;
