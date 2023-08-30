const express = require('express');
const router = express.Router();

const favouriteController = require('../../controllers/favourite/favourite.controller');
const tokenVerification = require('../../middleware/verifytoken');

router.post('/favourite', tokenVerification, favouriteController.favourite);
router.get('/fetch-favourite', tokenVerification, favouriteController.listFavorite);

module.exports = router