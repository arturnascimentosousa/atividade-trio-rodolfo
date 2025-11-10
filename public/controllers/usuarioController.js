require('dotenv').config();
const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  async cadastrar(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
      }
      const userExistente = await Usuario.findOne({ where: { email } });
      if (userExistente) {
        return res.status(400).json({ message: 'Email já cadastrado.' });
      }

      
      if (senha.length < 6) {
        return res.status(400).json({ 
          message: 'A senha deve ter no mínimo 6 caracteres.' 
        });
      }

    
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          message: 'Email inválido.' 
        });
      }

      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);
      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha: senhaHash
      });

     
      const token = jwt.sign(
        { 
          id: novoUsuario.id, 
          email: novoUsuario.email,
          nome: novoUsuario.nome
        },
        SECRET_KEY,
        { expiresIn: '24h' }
      );

    
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 
      });

      return res.status(201).json({
        message: 'Usuário criado com sucesso.',
        usuario: {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email
        },
        token
      });
    } catch (err) {
      console.error('Erro ao cadastrar usuário:', err);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
      }
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const payload = { id: usuario.id, email: usuario.email };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

      
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, 
        sameSite: 'lax'
      });

      return res.status(200).json({
        message: 'Login realizado com sucesso.',
        token: 'Bearer ' + token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
      });
    } catch (err) {
      console.error('Erro no login:', err);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
};
