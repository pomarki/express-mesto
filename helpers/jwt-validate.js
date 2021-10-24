const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs');

const jwtValidate = (token) => jwt.verify(token, JWT_SECRET);

module.exports = jwtValidate;
