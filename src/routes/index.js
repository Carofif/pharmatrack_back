const routerUsers = require('./users');
const routerNumeroUrgences = require('./numeroUrgences');
const routerDepartements = require('./departements');
const routerArrondissement= require('./arrondissements');
const routerCommunes = require('./communes');
const routerQuartiers = require('./quartiers');
const routerAssurances = require('./assurances');

const generateRoutes = (app) => {
  app.use('/users', routerUsers);
  app.use('/numeros-urgence', routerNumeroUrgences);
  app.use('/departements', routerDepartements);
  app.use('/arrondissements', routerArrondissement);
  app.use('/communes', routerCommunes);
  app.use('/quartiers', routerQuartiers);
  app.use('/assurances', routerAssurances);
};

module.exports = {
  generateRoutes,
};
