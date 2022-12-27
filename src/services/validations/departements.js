const { Departements } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId, pagination, isRequired } = require('./general');

const NAMESPACE = 'DEPARTEMENTS_VALIDATION';
const Model = Departements;

const nomInParams = {
  in: ['params'],
  ...isRequired,
};
const nomInBody = {
  in: ['body'],
  ...isRequired,
  trim: true,
  custom: {
    options: async (value) => {
      const nom = value || '';
      try {
        const data = await Departements.findOne({ where: { nom } });
        if (data) return Promise.reject('Ce département existe déjà.');
        return nom;
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

module.exports = {
  create: {
    nom: nomInBody,
  },
  update: {
    id: validationId(Model, NAMESPACE),
    nom: {
      ...nomInBody,
      optional: true,
    },
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  getByName: {
    nom: nomInParams,
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
  getAll: {
    ...pagination(),
  },
};
