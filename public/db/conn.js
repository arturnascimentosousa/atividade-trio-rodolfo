const { Sequelize } = require('sequelize');
require('dotenv').config();

const isDev = process.env.NODE_ENV !== 'production';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgresql',
  port: process.env.DB_PORT,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: isDev ? console.log : false
});

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro na inicialização do banco:', error);
  }
};

// Inicializa o banco
initDB();

module.exports = sequelize;
