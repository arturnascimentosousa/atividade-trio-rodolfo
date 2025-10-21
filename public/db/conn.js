const { Sequelize } = require('sequelize');
const { dotenv } = require('dotenv');
dotenv.config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgresql',
});

try {
  sequelize.authenticate();
  console.log('🔌 Conexão com o MySQL estabelecida com sucesso!');
} catch (error) {
  console.error('❌ Não foi possível conectar ao banco de dados:', error);
}
module.exports = sequelize;
