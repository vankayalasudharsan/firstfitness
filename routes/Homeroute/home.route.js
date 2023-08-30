const express = require('express');
const router = express.Router();

const homeController = require('../../controllers/Home/home.controller');
const tokenVerification = require('../../middleware/verifytoken');

router.post('/home-api',tokenVerification,homeController.fetchHomeapi);
router.post('/create-home', homeController.createHome);
router.get('/find-one',tokenVerification,homeController.findOne);

module.exports = router