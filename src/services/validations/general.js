const { isUUID } = require('validator');
const { error: loggingError } = require('../../config/logging');

const validationId = (model, namespace) => {
  return {
    in: ['params'],
    custom: {
      options: async (value) => {
        if (!isUUID(value, 4)) return Promise.reject('Doit être une UUID');
        try {
          const data = await model.findByPk(value);
          if (!data) {
            return Promise.reject('Cet élement n\'existe pas');
          }
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

module.exports = {
  validationId,
  pagination,
};
