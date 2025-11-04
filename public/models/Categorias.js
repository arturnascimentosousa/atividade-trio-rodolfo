module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'categorias',
    timestamps: false
  });

  Categoria.associate = (models) => {
    Categoria.hasMany(models.Ideia, {
      foreignKey: 'fk_categoria',
      as: 'ideias'
    });
  };

  return Categoria;
};
