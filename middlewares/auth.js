/* const jwt = require('jsonwebtoken'); */
const jwtValidate = require('../helpers/jwt-validate');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация №1' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwtValidate(token);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация №2' });
  }
  req.user = payload;
  next();
};
