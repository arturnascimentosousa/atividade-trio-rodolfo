const { Sequelize } = require('sequelize');
const sequelize = require('../conn');

async function fixVotosTable() {
  const t = await sequelize.transaction();

  try {
    // 1. Verificar se a coluna existe
    const [columns] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'votos' AND column_name = 'fk_usuario';
    `);

    // Se a coluna não existe, adiciona como nullable primeiro
    if (columns.length === 0) {
      await sequelize.query(`
        ALTER TABLE votos 
        ADD COLUMN fk_usuario INTEGER;
      `, { transaction: t });
    }

    // 2. Atualizar registros existentes
    // Assume que fk_user é a coluna antiga que referencia usuarios
    await sequelize.query(`
      UPDATE votos 
      SET fk_usuario = fk_user 
      WHERE fk_usuario IS NULL AND fk_user IS NOT NULL;
    `, { transaction: t });

    // 3. Verificar se ainda existem nulos
    const [nullCount] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM votos 
      WHERE fk_usuario IS NULL;
    `, { transaction: t });

    if (parseInt(nullCount[0].count) > 0) {
      throw new Error(`Ainda existem ${nullCount[0].count} votos sem usuário associado. Corrija os dados antes de adicionar as constraints.`);
    }

    // 4. Adicionar constraints
    await sequelize.query(`
      ALTER TABLE votos 
      ALTER COLUMN fk_usuario SET NOT NULL,
      ADD CONSTRAINT fk_votos_usuario 
      FOREIGN KEY (fk_usuario) 
      REFERENCES usuarios(id) 
      ON DELETE CASCADE 
      ON UPDATE CASCADE;
    `, { transaction: t });

    // Se chegou até aqui, commit na transação
    await t.commit();
    console.log('Migração concluída com sucesso!');

  } catch (error) {
    // Se der erro, rollback
    await t.rollback();
    console.error('Erro durante a migração:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Executar migração
fixVotosTable().catch(console.error);