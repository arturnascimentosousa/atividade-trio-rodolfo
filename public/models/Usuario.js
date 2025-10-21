module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    uid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Ideia, {
      foreignKey: 'fk_usuario_criador',
      as: 'ideias'
    });

    Usuario.belongsToMany(models.Ideia, {
      through: models.Voto,
      foreignKey: 'fk_user',
      otherKey: 'fk_ideia',
      as: 'votos'
    });
  };

  return Usuario;
};
