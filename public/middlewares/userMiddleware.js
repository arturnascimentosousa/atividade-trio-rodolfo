const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = async (req, res, next) => {
  try {
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
        const { Usuario } = require('../models');
        const user = await Usuario.findOne({
          where: { id: decoded.id },
          attributes: ['id', 'nome', 'email']
        });
        
        if (user) {
          res.locals.user = user.get({ plain: true });
          req.user = res.locals.user;
        }
      } catch (err) {
        console.error('Erro ao decodificar token:', err);
        res.clearCookie && res.clearCookie('token');
      }
    }
    next();
  } catch (err) {
    console.error('Erro no middleware de usuário:', err);
    next();
  }
};