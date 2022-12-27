const { isUUID } = require('validator');
const { validationResult } = require('express-validator');
const { error: loggingError } = require('../../config/logging');

const validationId = (model, namespace) => {
  return {
    in: ['params'],
    custom: {
      options: async (value, { req }) => {
        if (!isUUID(value, 4)) return Promise.reject('Doit être une UUID');
        try {
          const data = await model.findByPk(value);
          if (!data) {
            return Promise.reject('Cet élement n\'existe pas');
          }
          req.model = data;
          return value;
        } catch (e) {
          loggingError(namespace, e.message, e);
        }
      }
    },
  };
};

const pagination = () => {
  return {
    page: {
      in: ['query'],
      isInt: {
        if: value => !!value,
        options: { min: 1 },
        errorMessage: 'La page doit être un nombre supérieur à 0 si elle existe',
      },
      toInt: true,
    },
    limit: {
      in: ['query'],
      isInt: {
        if: (value, { req }) => !!value || !!req.query.page,
        options: { min: 1 },
        errorMessage: 'La limite doit être un nombre supérieur à 0 si elle existe ou si la page est renseignée',
      },
      toInt: true,
    },
  };
};

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
  return;
};

const isRequired = {
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire',
};

module.exports = {
  validationId,
  pagination,
  checkValidation,
  isRequired,
};
