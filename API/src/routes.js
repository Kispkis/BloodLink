const express = require('express');
const router = express.Router();
const v1Routes = require('./routes/v1');

router.get('/', (_req, res) => {
	res.json({
		service: 'BloodLink API',
		status: 'ok',
		versions: ['v1'],
	});
});

router.use('/api/v1', v1Routes);

module.exports = router;