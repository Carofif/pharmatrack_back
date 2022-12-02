const routerUsers = require('./users');
const routerNumeroUrgences = require('./numeroUrgences');

const generateRoutes = (app) => {
  app.use('/users', routerUsers);
  app.use('/numeros-urgence', routerNumeroUrgences);
};

module.exports = {
  generateRoutes,
};
