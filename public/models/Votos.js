module.exports = (sequelize, DataTypes) => {
  const Voto = sequelize.define('Voto', {
    fk_user: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    fk_ideia: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    tableName: 'votos',
    timestamps: false
  });

  return Voto;
};
