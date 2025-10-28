require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/conn'); 
const Usuario = require('../models/Usuario')(sequelize, DataTypes);
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

      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);
      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha: senhaHash
      });
      return res.status(201).json({
        message: 'Usuário criado com sucesso.',
        usuario: {
          uid: novoUsuario.uid,
          nome: novoUsuario.nome,
          email: novoUsuario.email
        }
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

      const payload = { uid: usuario.uid, email: usuario.email };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
      return res.status(200).json({
        message: 'Login realizado com sucesso.',
        token,
        usuario: { uid: usuario.uid, nome: usuario.nome, email: usuario.email }
      });
    } catch (err) {
      console.error('Erro no login:', err);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
};
