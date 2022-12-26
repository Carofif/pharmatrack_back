const jwt = require('jsonwebtoken');
const { server } = require('../config');

const generateUserToken = (dataToken, expiresIn) => {
  const token = jwt.sign(
    dataToken,
    server.secretToken,
    { expiresIn: expiresIn || '8h' }
  );
  return token;
};

module.exports = {
  generateUserToken,
};
