const { error: loggingError } = require('../../config/logging');

const validationId = (model, namespace) => {
  return {
    in: ['params'],
    custom: {
      options: async (value) => {
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

module.exports = {
  validationId,
};
