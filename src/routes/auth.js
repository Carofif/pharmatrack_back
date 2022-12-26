const controller = require('../controllers/auth');
const schema = require('../services/validations/auth');
const {
  validationToken,
  // adminRole,
  allRole,
  forUser
} = require('../midelware/auth');
const { poweringRoute } = require('../services/router');

module.exports = poweringRoute(schema, controller, [
  ['post', '/',                   'login'                                             ],
  ['get',  '/check-token',        'checkToken', allRole,              validationToken ],
  ['put',  '/change-mdp/:userId', 'changeMdp',  allRole,    forUser,  validationToken ],
]);