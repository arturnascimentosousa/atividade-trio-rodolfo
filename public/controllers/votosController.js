require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/conn'); 
const Votos = require('../models/Votos')(sequelize, DataTypes);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  async votar(req, res) {
    try {
      const { userId, ideiaId } = req.body;

      if (!userId || !ideiaId) {
        return res.status(400).json({ message: 'O id do usuário e o id da ideia são obrigatórios.' });
      }

      const novoVoto = await Votos.create({
        fk_user: userId,
        fk_ideia: ideiaId
      });
      return res.status(201).json({
        message: 'Voto criado com sucesso.',
        voto: {
          userId: novoVoto.userId,
          ideiaId: novoVoto.ideiaId
        }
      });
    } catch (err) {
      console.error('Erro ao cadastrar voto:', err);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  },
  
  async desvotar(req, res) {
    try {
    const { userId, ideiaId } = req.body;

    if (!userId || !ideiaId) {
      return res.status(400).json({ message: 'O id do usuário e o id da ideia são obrigatórios.' });
    }

    const deletado = await Votos.destroy({
      where: {
        fk_user: userId,
        fk_ideia: ideiaId
      }
    });

    if (deletado === 0) {
      return res.status(404).json({ message: 'Voto não encontrado.' });
    }

    return res.status(200).json({
      message: 'Voto removido com sucesso.'
    });
    } catch (err) {
        console.error('Erro ao remover voto:', err);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
};
