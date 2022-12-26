const { isUUID } = require('validator');
const { Pharmacie, Quartier } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId, pagination } = require('./general');

const NAMESPACE = 'PHARAMCIE_VALIDATION';
const Model = Pharmacie;

const nomInParams = {
  in: ['params'],
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire',
};

const nomInBody = {
  in: ['body'],
  custom: {
    options: async (value) => {
      const nom = value || '';
      try {
        const data = await Model.findOne({ where: { nom } });
        if (data) return Promise.reject('Cette pharmacie existe déjà');
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
      if (!value) return;
      if (!isUUID(value, 4)) return Promise.reject('Doit être une UUID');
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
  isFloat: true,
  errorMessage: 'La latitude doit être un nombre à virgule',
};

const longitude = {
  in: ['body'],
  isFloat: true,
  errorMessage: 'La longitude doit être un nombre à virgule',
};

const latLong = {
  in: ['body'],
  isLatLong: true,
  errorMessage: 'La latitude ou la longitude invalide',
};

const quartierIdIfExist = {
  in: ['body'],
  custom: {
    options: async (value) => {
      if (!value) return;
      if (!isUUID(value, 4)) return Promise.reject('Doit être une UUID');
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
    nom: {
      ...nomInBody,
      notEmpty: true,
      trim: true,
      errorMessage: 'Ce champ est obligatoire',
    },
    quartierId,
    ouvertToutTemps,
    latitude,
    longitude,
    latLong
  },
  update: {
    id: validationId(Model, NAMESPACE),
    nom: nomInBody,
    quartierId: quartierIdIfExist,
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
    latLong,
  },
};
