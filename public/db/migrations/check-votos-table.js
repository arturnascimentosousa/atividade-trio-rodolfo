const { Sequelize } = require('sequelize');
const sequelize = require('../conn');

async function checkVotosTable() {
  try {
    const [result] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'votos'
      ORDER BY ordinal_position;
    `);
    
    console.log('Estrutura atual da tabela votos:');
    console.table(result);
    
    const [nullCount] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM votos
      WHERE fk_user IS NULL;
    `);
    
    console.log('\nQuantidade de votos sem usuário:', nullCount[0].count);
    
  } catch (error) {
    console.error('Erro ao verificar tabela:', error);
  } finally {
    await sequelize.close();
  }
}

checkVotosTable();