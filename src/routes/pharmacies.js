const controller = require('../controllers/pharmacies');
const schema = require('../services/validations/pharmacies');
const { poweringRoute } = require('../services/router');

const addLatLongInBody = (req, res, next) => {
  const { latitude, longitude } = req.body;
  req.body.latLong = `${latitude},${longitude}`;
  next();
};

module.exports = poweringRoute(schema, controller, [
  ['get',     '/',          'getAll',     addLatLongInBody  ],
  ['post',    '/',          'create',     addLatLongInBody  ],
  ['get',     '/:id',       'getOne'                        ],
  ['delete',  '/:id',       'deleteOne'                     ],
  ['put',     '/:id',       'update',     addLatLongInBody  ],
  ['get',     '/name/:nom', 'getByName'                     ],
]);