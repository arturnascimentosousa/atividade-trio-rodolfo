require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/conn');


const Ideia = require('../models/Ideias')(sequelize, DataTypes);
const Categoria = require('../models/Categorias')(sequelize, DataTypes);
const Usuario = require('../models/Usuario')(sequelize, DataTypes);

module.exports = {
  async criar(req, res) {
    try {
      const { titulo, detalhes, fk_categoria } = req.body;

      if (!titulo || !fk_categoria) {
        return res.status(400).json({
          erro: 'Campos obrigatórios ausentes',
          detalhes: 'Título e categoria são obrigatórios.'
        });
      }

      const categoria = await Categoria.findByPk(fk_categoria);
      if (!categoria) {
        return res.status(400).json({
          erro: 'Categoria inválida',
          detalhes: `Categoria com ID ${fk_categoria} não existe.`
        });
      }

      const ideia = await Ideia.create({
        titulo,
        detalhes,
        fk_categoria,
        fk_usuario_criador: req.user.id
      });

      res.status(201).json({
        mensagem: 'Ideia criada com sucesso',
        ideia
      });
    } catch (err) {
      console.error('Erro ao criar ideia:', err);
      res.status(500).json({
        erro: 'Erro interno ao criar ideia',
        detalhes: err.message
      });
    }
  },

  async listar(req, res) {
    try {
      const ideias = await Ideia.findAll({
        include: [
          { model: Categoria, as: 'categoria', attributes: ['id', 'nome'] },
          { model: Usuario, as: 'criador', attributes: ['id', 'nome', 'email'] },
          {
            model: Voto,
            as: 'votos',
            attributes: ['fk_user'],
            required: false
          }
        ],
        order: [['id', 'DESC']] 
      });

      
      const ideiasProcessadas = ideias.map(ideia => {
        const plain = ideia.get({ plain: true });
        plain.votoCount = plain.votos ? plain.votos.length : 0;
        plain.userVoted = plain.votos ? plain.votos.some(v => v.fk_user === req.user.id) : false;
        delete plain.votos; 
        return plain;
      });

      res.status(200).json(ideiasProcessadas);
      
    } catch (err) {
      console.error('Erro ao listar ideias:', err);
      res.status(500).json({
        erro: 'Erro interno ao listar ideias',
        detalhes: err.message
      });
    }
  },

  async detalhar(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({
          erro: 'Parâmetro inválido',
          detalhes: 'O ID informado deve ser numérico.'
        });
      }

      const ideia = await Ideia.findByPk(id);

      if (!ideia) {
        return res.status(404).json({ erro: 'Ideia não encontrada' });
      }

      res.status(200).json(ideia);
    } catch (err) {
      console.error('Erro ao buscar ideia:', err);
      res.status(500).json({
        erro: 'Erro interno ao buscar ideia',
        detalhes: err.message
      });
    }
  },

  async votar(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const ideia = await Ideia.findByPk(id);
      if (!ideia) {
        return res.status(404).json({ erro: 'Ideia não encontrada' });
      }

      
      const votoExistente = await Voto.findOne({
        where: { fk_ideia: id, fk_user: userId }
      });

      if (votoExistente) {
        
        await votoExistente.destroy();
        
        
        const votoCount = await Voto.count({
          where: { fk_ideia: id }
        });

        return res.json({
          mensagem: 'Voto removido',
          userVoted: false,
          votoCount
        });
      }

      
      await Voto.create({
        fk_ideia: id,
        fk_user: userId
      });

      
      const votoCount = await Voto.count({
        where: { fk_ideia: id }
      });

      res.json({
        mensagem: 'Voto registrado',
        userVoted: true,
        votoCount
      });

    } catch (err) {
      console.error('Erro ao processar voto:', err);
      res.status(500).json({
        erro: 'Erro interno ao processar voto',
        detalhes: err.message
      });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { titulo, detalhes, fk_categoria } = req.body;
      const userId = req.user.id;

      if (isNaN(id)) {
        return res.status(400).json({
          erro: 'Parâmetro inválido',
          detalhes: 'O ID informado deve ser numérico.'
        });
      }

      
      const ideia = await Ideia.findOne({
        where: {
          id: id,
          fk_usuario_criador: userId
        }
      });

      if (!ideia) {
        return res.status(404).json({ 
          erro: 'Ideia não encontrada',
          detalhes: 'Ideia não existe ou você não tem permissão para editá-la'
        });
      }

      if (fk_categoria) {
        const categoria = await Categoria.findByPk(fk_categoria);
        if (!categoria) {
          return res.status(400).json({
            erro: 'Categoria inválida',
            detalhes: `Categoria com ID ${fk_categoria} não existe.`
          });
        }
      }

      if (!titulo && !detalhes && !fk_categoria) {
        return res.status(400).json({
          erro: 'Nada a atualizar',
          detalhes: 'Informe ao menos um campo para atualização.'
        });
      }

      await ideia.update({ titulo, detalhes, fk_categoria });
      res.status(200).json({
        mensagem: 'Ideia atualizada com sucesso',
        ideia
      });
    } catch (err) {
      console.error('Erro ao atualizar ideia:', err);
      res.status(500).json({
        erro: 'Erro interno ao atualizar ideia',
        detalhes: err.message
      });
    }
  },

async remover(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (isNaN(id)) {
      return res.status(400).json({
        erro: 'Parâmetro inválido',
        detalhes: 'O ID informado deve ser numérico.'
      });
    }

    const ideia = await Ideia.findOne({
      where: {
        id,
        fk_usuario_criador: userId
      }
    });

    if (!ideia) {
      return res.status(404).json({
        erro: 'Ideia não encontrada ou você não pode deletá-la'
      });
    }

    await ideia.destroy();

    res.status(200).json({ mensagem: 'Ideia removida com sucesso' });

  } catch (err) {
    console.error('Erro ao remover ideia:', err);
    res.status(500).json({
      erro: 'Erro interno ao remover ideia',
      detalhes: err.message
    });
  }
}

};
