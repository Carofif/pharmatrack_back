const controller = require('../controllers/pharmacies');
const schema = require('../services/validations/pharamcies');
const { poweringRoute } = require('../services/router');

module.exports = poweringRoute(schema, controller, [
  ['get',     '/',          'getAll'    ],
  ['post',    '/',          'create'    ],
  ['get',     '/:id',       'getOne'    ],
  ['delete',  '/:id',       'deleteOne' ],
  ['put',     '/:id',       'update'    ],
  ['get',     '/name/:nom', 'getByName' ],
]);