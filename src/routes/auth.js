const controller = require('../controllers/auth');
const schema = require('../services/validations/auth');
const { validationToken } = require('../midelware/auth');
const { poweringRoute } = require('../services/router');

module.exports = poweringRoute(schema, controller, [
  ['post',  '/',                'login'                         ],
  ['get',   '/check-token',     'checkToken',   validationToken ],
  ['put',   '/change-mdp/:id',  'changeMdp',    validationToken ],
]);