const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Usuario = require('./Usuario')(sequelize, DataTypes);
const Ideia = require('./Ideias')(sequelize, DataTypes);
const Categoria = require('./Categorias')(sequelize, DataTypes);
const Voto = require('./Votos')(sequelize, DataTypes);

Usuario.hasMany(Ideia, {
  foreignKey: 'fk_usuario_criador',
  as: 'ideias'
});

Ideia.belongsTo(Usuario, {
  foreignKey: 'fk_usuario_criador',
  as: 'criador'
});

Ideia.belongsTo(Categoria, {
  foreignKey: 'fk_categoria',
  as: 'categoria'
});

Usuario.belongsToMany(Ideia, {
  through: Voto,
  foreignKey: 'fk_user',
  otherKey: 'fk_ideia',
  as: 'votos'
});

Ideia.belongsToMany(Usuario, {
  through: Voto,
  foreignKey: 'fk_ideia',
  otherKey: 'fk_user',
  as: 'usuarios_que_votaram'
});

module.exports = {
  sequelize,
  Usuario,
  Ideia,
  Categoria,
  Voto
};