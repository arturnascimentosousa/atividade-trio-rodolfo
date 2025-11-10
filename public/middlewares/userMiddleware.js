const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware para tentar carregar usuário do token em todas as requests
module.exports = async (req, res, next) => {
  try {
    // token pode vir do cookie ou do header Authorization
    const tokenFromCookie = req.cookies && req.cookies.token;
    const authHeader = req.headers && req.headers.authorization;
    let token = null;

    if (tokenFromCookie) {
      token = tokenFromCookie;
    } else if (authHeader) {
      const parts = authHeader.split(' ');
      token = parts.length === 2 ? parts[1] : null;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // Buscar dados completos do usuário
        const { Usuario } = require('../models');
        const user = await Usuario.findOne({
          where: { id: decoded.id },
          attributes: ['id', 'nome', 'email'] // só os campos necessários
        });
        
        if (user) {
          // Disponibilizar usuário para todas as views
          res.locals.user = user.get({ plain: true });
          // Também disponibilizar no objeto req para as rotas
          req.user = res.locals.user;
        }
      } catch (err) {
        console.error('Erro ao decodificar token:', err);
        // Se token inválido, limpa cookie
        res.clearCookie && res.clearCookie('token');
      }
    }
    next();
  } catch (err) {
    console.error('Erro no middleware de usuário:', err);
    next();
  }
};