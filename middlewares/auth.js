const jwtValidate = require('../helpers/jwt-validate');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwtValidate(token);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
