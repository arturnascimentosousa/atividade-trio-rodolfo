const express = require('express');
const router = express.Router();
const ideiaController = require('../controllers/ideiaController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAuthor = require('../middlewares/isAuthor');

router.post('/criar', authMiddleware, ideiaController.criar);
router.put('/atualizar/:id', authMiddleware, isAuthor, ideiaController.atualizar);
router.delete('/remover/:id', authMiddleware, isAuthor, ideiaController.remover);

router.get('/listar', authMiddleware, ideiaController.listar);
router.get('/detalhar/:id', authMiddleware, ideiaController.detalhar);

// Rota para votar em uma ideia
router.post('/:id/votar', authMiddleware, ideiaController.votar);

module.exports = router;
