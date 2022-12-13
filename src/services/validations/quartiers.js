const { Quartier, Commune } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId } = require('./general');

const NAMESPACE = 'QUARTIER_VALIDATION';
const Model = Quartier;

const nom = {
  in: ['params', 'body'],
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      try {
        const data = await Quartier.findByPk(value);
        if (!data) {
          return Promise.reject('Ce quartier n\'existe pas');
        }
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

const communeId = {
  in: ['body'],
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      try {
        const data = await Commune.findByPk(value);
        if (!data) {
          return Promise.reject('Cette commune n\'existe pas');
        }
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

const communeIdIfExist = {
  in: ['body'],
  custom: {
    options: async (value) => {
      if (!value) return;
      try {
        const data = await Commune.findByPk(value);
        if (!data) {
          return Promise.reject('Cette commune n\'existe pas');
        }
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

module.exports = {
  create: {
    nom,
    communeId,
  },
  update: {
    id: validationId(Model, NAMESPACE),
    communeId: communeIdIfExist
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  getQuartierByName: {
    nom,
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
};
