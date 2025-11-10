require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./public/db/conn');
const ideiaRoutes = require('./public/routes/ideiaRoutes');
const usuarioRoutes = require('./public/routes/usuarioRoutes');
const votosRoutes = require('./public/routes/votosRoutes')
const { engine } = require('express-handlebars');
const userMiddleware = require('./public/middlewares/userMiddleware');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers && req.headers.cookie;
  if (!cookieHeader) return next();
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const key = parts.shift().trim();
    const value = parts.join('=').trim();
    try {
      req.cookies[key] = decodeURIComponent(value);
    } catch (e) {
      req.cookies[key] = value;
    }
  });
  next();
});

app.use(userMiddleware);

app.use('/views', express.static(path.join(__dirname, 'src', 'views'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.engine('hbs', engine({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'src', 'views', 'layout'),
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'src', 'views', 'partials'),
  helpers: {
    eq: function (a, b) { return a === b; },
    ne: function (a, b) { return a !== b; },
    gt: function (a, b) { return a > b; },
    lt: function (a, b) { return a < b; },
    formatDate: function (date) {
      return new Date(date).toLocaleDateString('pt-BR');
    },
    json: function (context) {
      return JSON.stringify(context);
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', express.static(path.join(__dirname, 'src', 'views', 'auth')));

app.use('/layout', express.static(path.join(__dirname, 'src', 'views', 'layout')));
app.use('/partials', express.static(path.join(__dirname, 'src', 'views', 'partials')));
app.use('/views', express.static(path.join(__dirname, 'src', 'views'))); 

app.use('/', require('./src/route/route'));
app.use('/usuario', usuarioRoutes);
app.use('/ideia', ideiaRoutes);
app.use('/votos', votosRoutes)

sequelize
  .sync({ alter: true }) 
  .then(() => {
    console.log('Banco sincronizado com sucesso!');
    app.listen(PORT, () =>
      console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`)
    );
  })
  .catch((err) =>
    console.log('Erro ao conectar com o banco de dados:', err)
  );
