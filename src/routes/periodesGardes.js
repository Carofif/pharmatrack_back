const controller = require('../controllers/periodesGardes');
const schema = require('../services/validations/periodesGardes');
const { poweringRoute } = require('../services/router');

module.exports = poweringRoute(schema, controller, [
  ['get',     '/',                  'getAll'                ],
  ['post',    '/',                  'create'                ],
  ['post',    '/all',               'createAll'             ],
  ['post',    '/all/:pharmacieId',  'createAllForPharmacie' ],
  ['get',     '/:id',               'getOne'                ],
  ['delete',  '/:id',               'deleteOne'             ],
  ['put',     '/:id',               'update'                ],
]);