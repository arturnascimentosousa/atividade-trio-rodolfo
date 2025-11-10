const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota para renderizar página de cadastro
router.get('/cadastro', (req, res) => {
  if (req.user) {
    return res.redirect('/ideia');
  }
  res.render('auth/cadastro', {
    layout: 'main',
    title: 'Cadastro',
    auth: true
  });
});

// Rota para renderizar página de login
router.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/ideia');
  }
  res.render('auth/login', {
    layout: 'main',
    title: 'Login',
    auth: true
  });
});

// Rota para processar cadastro
router.post('/cadastro', usuarioController.cadastrar);

// Rota para processar login
router.post('/login', usuarioController.login);

// Rota para logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/usuario/login');
});

module.exports = router;
