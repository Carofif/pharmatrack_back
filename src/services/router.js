
const { Router } = require('express');
const { checkSchema } = require('express-validator');
const { checkValidation } = require('./validations/general');

const router = Router();

const ping = (req, res) => {
  try {
    return res.status(200).send('ping');
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

router.get('/ping', checkValidation, ping);

const poweringRoute = (schema, controller, list) => {
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
