const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

// Carrega o model Ideias usando a mesma convenção que os controllers
const Ideia = require('../models/Ideias')(sequelize, DataTypes);

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }

    if (!id || isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const ideia = await Ideia.findByPk(id);
    if (!ideia) {
      return res.status(404).json({ erro: 'Ideia não encontrada.' });
    }

    // Verifica se o usuário logado é o criador/autor da ideia
    if (ideia.fk_usuario_criador !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado. Somente o autor da ideia pode realizar essa ação.' });
    }

    // autor confirmado
    next();
  } catch (err) {
    console.error('Erro no middleware isAuthor:', err);
    res.status(500).json({ erro: 'Erro interno no middleware de autorização.' });
  }
};
