const controller = require('../controllers/numeroUrgences');
const schema = require('../services/validations/numeroUrgences');
const { poweringRoute } = require('../services/router');

module.exports = poweringRoute(schema, controller, [
  ['get',     '/',      'getAll'    ],
  ['post',    '/',      'create'    ],
  ['get',     '/:id',   'getOne'    ],
  ['delete',  '/:id',   'deleteOne' ],
  ['put',     '/:id',   'update'    ],
]);
