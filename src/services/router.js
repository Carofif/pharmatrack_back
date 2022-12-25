
const { Router } = require('express');
const { checkSchema } = require('express-validator');
const { checkValidation } = require('./validations/general');


const ping = (req, res) => {
  try {
    return res.status(200).send('ping');
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};


const poweringRoute = (schema, controller, list) => {
  const router = Router();
  router.get('/ping', checkValidation, ping);
  list.forEach(([method, path, name, ...other]) => {
    router[method](
      path, ...other,
      schema[name]
        ? checkSchema(schema[name])
        : (req, res, next) => { next(); },
      checkValidation,
      controller[name],
    );
  });
  return router;
};


module.exports = {
  poweringRoute,
};
