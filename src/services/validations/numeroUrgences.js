const { NumeroUrgence } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId, pagination } = require('./general');

const NAMESPACE = 'NUMERO_URGENCE_VALIDATION';
const Model = NumeroUrgence;

const nom = {
  in: ['body'],
  notEmpty: true,
  trim: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      const nom = value || '';
      try {
        const data = await Model.findOne({ where: { nom } });
        if (data) return Promise.reject('Ce numéro d\'urgence existe déjà.');
        return nom;
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};
const telephone = {
  in: ['body'],
  notEmpty: true,
  trim: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      const telephone = value || '';
      try {
        const data = await Model.findOne({ where: { telephone } });
        if (data) return Promise.reject('Ce numéro d\'urgence existe déjà.');
        return telephone;
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};



module.exports = {
  create: {
    nom,
    telephone,
  },
  update: {
    id: validationId(Model, NAMESPACE),
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
  getAll: {
    ...pagination(),
  },
};
