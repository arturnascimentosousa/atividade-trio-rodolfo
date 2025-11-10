module.exports = (sequelize, DataTypes) => {
  const Voto = sequelize.define('Voto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fk_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    fk_ideia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ideias',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'votos',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['fk_user', 'fk_ideia'],
        name: 'votos_fk_user_fk_ideia'
      }
    ]
  });

  Voto.associate = (models) => {
    Voto.belongsTo(models.Usuario, {
      foreignKey: 'fk_user',
      as: 'usuario'
    });
    Voto.belongsTo(models.Ideia, {
      foreignKey: 'fk_ideia',
      as: 'ideia'
    });
  };

  return Voto;
};
