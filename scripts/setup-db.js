require('dotenv').config();
const recriarCategorias = require('../public/db/migrations/recriar-categorias');

async function setup() {
  try {
    console.log('Recriando categorias...');
    await recriarCategorias();
    console.log('Categorias recriadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao recriar categorias:', error);
    process.exit(1);
  }
}

setup();