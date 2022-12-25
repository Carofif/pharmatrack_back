const { isUUID } = require('validator');
const { roles } = require('../../config/user');
const { Utilisateur, Pharmacie } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { mdpValidation } = require('../user');
const { validationId, pagination } = require('./general');

const NAMESPACE = 'USER_VALIDATION';
const Model = Utilisateur;
// const ROLES = [roles.aucun, roles.pharmacien, roles.employe, roles.administrateur];
const ROLES = Object.values(roles);

const email = {
  in: ['body'],
  isEmail: true,
  trim: true,
  errorMessage: 'Email invalide',
  custom: {
    options: async (value) => {
      if (!value) return value;
      try {
        const data = await Model.findOne({ where: { email: value } });
        if (data) return Promise.reject('Cet utilisateur existe déjà');
        return value;
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

const role = {
  in: ['body'],
  trim: true,
  if: {
    options: (value) => ROLES.includes(value),
    errorMessage: 'La valeur du champ role est inconrect'
  },
};

const pharmacieId = {
  in: ['body'],
  custom: {
    options: async (value) => {
      if (!value) return null;
      if (!isUUID(value, 4)) return Promise.reject('Doit être une UUID');
      try {
        const data = await Pharmacie.findByPk(value);
        if (!data) return Promise.reject('Ce département n\'existe pas');
        return value;
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

const motDePasse = {
  in: ['body'],
  if: {
    options: value => mdpValidation(value),
    errorMessage: 'Le mot de passe doit avoir au moins 6 caractères',
  },
};

module.exports = {
  create: {
    email,
    role,
    pharmacieId,
    motDePasse,
    nom: {
      in: ['body'],
      trim: true,
    },
    prenoms: {
      in: ['body'],
      trim: true,
    },
  },
  update: {
    userId: validationId(Model, NAMESPACE),
    pharmacieId,
    role,
    nom: {
      in: ['body'],
      trim: true,
    },
    prenoms: {
      in: ['body'],
      trim: true,
    },
    email: {
      ...email,
      isEmail: {
        if: value => !!value
      },
    },
  },
  getOne: {
    userId: validationId(Model, NAMESPACE),
  },
  deleteOne: {
    userId: validationId(Model, NAMESPACE),
  },
  getAll: {
    ...pagination()
  },
};
