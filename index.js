const express = require('express');
const conn = require('./public/db/conn');
const Usuario = require('./public/models/Usuario');
const usuarioRoutes = require('./public/routes/usuarioRoutes');
const { engine } = require('express-handlebars');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use('/usuario', usuarioRoutes);

// 5. CONEXÃO COM O BANCO E INICIALIZAÇÃO DO SERVIDOR
conn
  .sync({ alter: true }) // <-- adiciona/atualiza colunas da tabela automaticamente
  .then(() => {
    console.log('Banco sincronizado com sucesso!');
    app.listen(PORT, () =>
      console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`)
    );
  })
  .catch((err) =>
    console.log('Erro ao conectar com o banco de dados:', err)
  );
