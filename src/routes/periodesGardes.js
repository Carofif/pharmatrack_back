const controller = require('../controllers/periodesGardes');
const schema = require('../services/validations/periodesGardes');
const { poweringRoute } = require('../services/router');

module.exports = poweringRoute(schema, controller, [
  ['get',     '/',          'getAll'    ],
  ['post',    '/',          'create'    ],
  ['get',     '/:id',       'getOne'    ],
  ['delete',  '/:id',       'deleteOne' ],
  ['put',     '/:id',       'update'    ],
]);