const controller = require('../controllers/users');
const schema = require('../services/validations/users');
const { poweringRoute } = require('../services/router');

module.exports = poweringRoute(schema, controller, [
  ['get',     '/',     'getAll'     ],
  ['post',    '/',     'create'     ],
  ['get',     '/:id',  'getOne'     ],
  ['delete',  '/:id',  'deleteOne'  ],
  ['put',     '/:id',  'create'     ],
]);
