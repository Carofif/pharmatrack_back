const routerAuth = require('./auth');
const routerUsers = require('./users');
const routerNumeroUrgences = require('./numeroUrgences');
const routerDepartements = require('./departements');
const routerArrondissement= require('./arrondissements');
const routerCommunes = require('./communes');
const routerQuartiers = require('./quartiers');
const routerAssurances = require('./assurances');
const routerPharmacies = require('./pharmacies');
const routerPeriodesGardes = require('./periodesGardes');

const generateRoutes = (app) => {
  app.use('/auth', routerAuth);
  app.use('/users', routerUsers);
  app.use('/numeros-urgence', routerNumeroUrgences);
  app.use('/departements', routerDepartements);
  app.use('/arrondissements', routerArrondissement);
  app.use('/communes', routerCommunes);
  app.use('/quartiers', routerQuartiers);
  app.use('/assurances', routerAssurances);
  app.use('/pharmacies', routerPharmacies);
  app.use('/periodes-gardes', routerPeriodesGardes);
};

module.exports = {
  generateRoutes,
};
