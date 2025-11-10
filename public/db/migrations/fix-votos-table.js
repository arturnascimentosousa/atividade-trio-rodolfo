const { Sequelize } = require('sequelize');
const sequelize = require('../conn');

async function fixVotosTable() {
  try {
    // 1. Criar backup da tabela votos (opcional)
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS votos_backup AS 
      SELECT * FROM votos;
    `);

    // 2. Limpar a tabela votos
    await sequelize.query('TRUNCATE TABLE votos CASCADE;');

    // 3. Remover a tabela votos
    await sequelize.query('DROP TABLE IF EXISTS votos;');

    // 4. Recriar a tabela com a estrutura correta
    await sequelize.query(`
      CREATE TABLE votos (
        id SERIAL PRIMARY KEY,
        fk_usuario INTEGER NOT NULL REFERENCES usuarios(id),
        fk_ideia INTEGER NOT NULL REFERENCES ideias(id),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);

    console.log('Tabela votos corrigida com sucesso!');
  } catch (error) {
    console.error('Erro ao corrigir tabela votos:', error);
  } finally {
    await sequelize.close();
  }
}

fixVotosTable();