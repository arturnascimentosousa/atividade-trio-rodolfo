const express = require('express');
const router = express.Router();
const votosController = require('../controllers/votosController');

router.post('/votar', votosController.votar);

router.post('/desvotar', votosController.desvotar);

module.exports = router;