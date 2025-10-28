const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgresql',
  port: process.env.DB_PORT,
  dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
  }
});

try {
  sequelize.authenticate();
  console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
} catch (error) {
  console.error('Não foi possível conectar ao banco de dados:', error);
}
module.exports = sequelize;
