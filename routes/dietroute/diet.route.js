const express = require('express');
const router = express.Router();

const dietController = require('../../controllers/diet/diet.controller');
const tokenVerification = require('../../middleware/verifytoken');

router.get('/fetch-diet',tokenVerification,dietController.fetchDiet);
router.post('/create-diet', dietController.createDiet);

module.exports = router