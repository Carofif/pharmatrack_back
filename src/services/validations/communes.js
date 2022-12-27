const { isUUID } = require('validator');
const { Arrondissement, Commune } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId, pagination, isRequired  } = require('./general');

const NAMESPACE = 'COMMUNE_VALIDATION';
const Model = Commune;

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
        const data = await Model.findOne({ where: { nom } });
        if (data) return Promise.reject('Cette commune existe déjà');
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

const arrondissementId = {
  in: ['body'],
  ...isRequired,
  custom: {
    options: async (value) => {if (!value) return;
      if (!isUUID(value, 4)) return Promise.reject('Doit être une UUID');
      try {
        const data = await Arrondissement.findByPk(value);
        if (!data) {
          return Promise.reject('Cet arrondissement n\'existe pas');
        }
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

module.exports = {
  create: {
    nom: nomInBody,
    arrondissementId,
  },
  update: {
    id: validationId(Model, NAMESPACE),
    nom: {
      ...nomInBody,
      optional: true,
    },
    arrondissementId: {
      ...arrondissementId,
      optional: true,
    }
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
