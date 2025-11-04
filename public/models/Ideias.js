module.exports = (sequelize, DataTypes) => {
  const Ideia = sequelize.define('Ideia', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fk_usuario_criador: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fk_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    detalhes: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'ideias',
    timestamps: false
  });

  Ideia.associate = (models) => {
    Ideia.belongsTo(models.Usuario, {
      foreignKey: 'fk_usuario_criador',
      as: 'criador'
    });

    Ideia.belongsTo(models.Categoria, {
      foreignKey: 'fk_categoria',
      as: 'categoria'
    });

    Ideia.belongsToMany(models.Usuario, {
      through: models.Voto,
      foreignKey: 'fk_ideia',
      otherKey: 'fk_user',
      as: 'usuarios_que_votaram'
    });
  };

  return Ideia;
};
