const { Sequelize } = require('sequelize');
const sequelize = require('../conn');

const categorias = [
  { id: 1, nome: 'Inovação e Tecnologia' },
  { id: 2, nome: 'Melhoria de Processos' },
  { id: 3, nome: 'Redução de Custos' },
  { id: 4, nome: 'Novos Produtos ou Serviços' },
  { id: 5, nome: 'Sustentabilidade' },
  { id: 6, nome: 'Experiência do Cliente' },
  { id: 7, nome: 'Cultura e Engajamento' },
  { id: 8, nome: 'Eficiência Operacional' },
  { id: 9, nome: 'Transformação Digital' },
  { id: 10, nome: 'Impacto Social' }
];

async function recriarCategorias() {
  try {
    // Criar tabela categorias se não existir
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Inserir categorias apenas se a tabela estiver vazia
    const [results] = await sequelize.query('SELECT COUNT(*) FROM categorias;');
    const count = parseInt(results[0].count);

    // Inserir ou garantir existência das categorias com ids fixos
    for (const categoria of categorias) {
      await sequelize.query(`
        INSERT INTO categorias (id, nome, "createdAt", "updatedAt")
        SELECT :id, :nome, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE id = :id);
      `, {
        replacements: categoria
      });
    }
    console.log('Categorias verificadas/inseridas com sucesso!');

  } catch (error) {
    console.error('Erro ao recriar categorias:', error);
  } finally {
    await sequelize.close();
  }
}

recriarCategorias();