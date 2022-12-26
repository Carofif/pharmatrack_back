const controller = require('../controllers/users');
const schema = require('../services/validations/users');
const { poweringRoute } = require('../services/router');
const {
  validationToken,
  adminRole,
  allRole,
  forUser
} = require('../midelware/auth');

module.exports = poweringRoute(schema, controller, [
  ['get',     '/',         'getAll',    adminRole,           validationToken ],
  ['post',    '/',         'create'                                          ],
  ['get',     '/:userId',  'getOne',    allRole,    forUser, validationToken ],
  ['delete',  '/:userId',  'deleteOne', allRole,    forUser, validationToken ],
  ['put',     '/:userId',  'update',    allRole,    forUser, validationToken ],
]);
