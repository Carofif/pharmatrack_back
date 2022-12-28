const { isUUID } = require('validator');
const { Pharmacie, Quartier } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId, pagination, isRequired } = require('./general');
const moment = require('moment/moment');

const NAMESPACE = 'PHARAMCIE_VALIDATION';
const Model = Pharmacie;

const nomInParams = {
  in: ['params'],
  ...isRequired,
};

const nomInBody = {
  in: ['body'],
  ...isRequired,
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
  ...isRequired,
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
  toBoolean: true,
  ...isRequired,
  isBoolean: {
    options: { loose: false },
    errorMessage: 'Le champ "ouvertToutTemps" doit être un booléen',
  },
};

const latitude = {
  in: ['body'],
  ...isRequired,
  toFloat: true,
  isFloat: {
    errorMessage: 'Le champ "latitude" doit être un nombre à virgule',
  },
};

const longitude = {
  in: ['body'],
  ...isRequired,
  toFloat: true,
  isFloat: {
    errorMessage: 'Le champ "longitude" doit être un nombre à virgule',
  },
};

const latLong = {
  in: ['body'],
  isLatLong: {
    errorMessage: 'Le champ "Latitude" ou "longitude" est invalide',
  },
};

const rayon = {
  in: ['query'],
  ...isRequired,
  toFloat: true,
  isFloat: {
    errorMessage: 'Le champ "rayon" doit être un nombre à virgule',
  },
};

const heureOuverture = {
  in: ['body'],
  ...isRequired,
  custom: {
    options: (value) => moment(value, 'HH:mm').isValid(),
    errorMessage: 'Le champ "heureOuverture" doit être au format "HH:mm"',
  },
};

const heureFermeture = {
  in: ['body'],
  ...isRequired,
  custom: {
    options: (value) => moment(value, 'HH:mm').isValid(),
    errorMessage: 'Le champ "heureFermeture" doit être au format "HH:mm"',
  },
};

module.exports = {
  create: {
    nom: nomInBody,
    quartierId,
    ouvertToutTemps,
    latitude,
    longitude,
    latLong,
    heureOuverture,
    heureFermeture,
  },
  update: {
    id: validationId(Model, NAMESPACE),
    nom: {
      ...nomInBody,
      optional: true,
    },
    quartierId: {
      ...quartierId,
      optional: true,
    },
    ouvertToutTemps: {
      ...ouvertToutTemps,
      optional: true,
    },
    latitude: {
      ...latitude,
      optional: true,
    },
    longitude: {
      ...longitude,
      optional: true,
    },
    latLong: {
      ...latLong,
      optional: true,
    },
    heureOuverture: {
      ...heureOuverture,
      optional: true,
    },
    heureFermeture: {
      ...heureFermeture,
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
    quartierId: {
      ...quartierId,
      in: ['query'],
      optional: true,
    },
    ouvertToutTemps: {
      ...ouvertToutTemps,
      in: ['query'],
      optional: true,
    },
    latitude: {
      ...latitude,
      in: ['query'],
    },
    longitude: {
      ...longitude,
      in: ['query'],
    },
    latLong: {
      ...latLong,
      in: ['query'],
    },
    rayon,
  },
};
