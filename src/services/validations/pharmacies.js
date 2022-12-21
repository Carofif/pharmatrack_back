const { Pharmacie, Quartier } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId } = require('./general');

const NAMESPACE = 'PHARAMCIE_VALIDATION';
const Model = Pharmacie;

const nom = {
  in: ['params', 'body'],
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      try {
        const data = await Pharmacie.findByPk(value);
        if (!data) {
          return Promise.reject('Cette pharmacie n\'existe pas');
        }
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

const quartierId = {
  in: ['body'],
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

const ouvertToutTemps = {
  in: ['body'],
  isBoolean: true,
  errorMessage: 'Ce champ doit être un booléen',
};

const latitude = {
  in: ['body'],
  notEmpty: true,
  isLatitude: true,
  errorMessage: 'La latitude n\'est pas valide',
};
const longitude = {
  in: ['body'],
  notEmpty: true,
  isLongitude: true,
  errorMessage: 'La longitude n\'est pas valide',
};
const quartierIdIfExist = {
  in: ['body'],
  custom: {
    options: async (value) => {
      if (!value) return;
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

module.exports = {
  create: {
    nom,
    quartierId,
    ouvertToutTemps,
    latitude,
    longitude,
  },
  update: {
    id: validationId(Model, NAMESPACE),
    quartierId: quartierIdIfExist,
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  getByName: {
    nom,
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
};
