const express = require('express');
const router = express.Router();
const ideiaController = require('../controllers/ideiaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/criar', authMiddleware, ideiaController.criar);
router.put('/atualizar/:id', authMiddleware, ideiaController.atualizar);
router.delete('/remover/:id', authMiddleware, ideiaController.remover);

router.get('/listar', authMiddleware, ideiaController.listar);
router.get('/detalhar/:id', authMiddleware, ideiaController.detalhar);

module.exports = router;
