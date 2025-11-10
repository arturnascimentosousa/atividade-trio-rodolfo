const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

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

router.post('/cadastro', usuarioController.cadastrar);

router.post('/login', usuarioController.login);

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/usuario/login');
});

module.exports = router;
