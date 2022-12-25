const { roles } = require('../../config/user');
const { User } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId, pagination } = require('./general');

const NAMESPACE = 'USER_VALIDATION';
const Model = User;
const ROLES = [roles.aucun, roles.pharmacien, roles.employe];

const email = {
  in: ['body'],
  isEmail: true,
  trim: true,
  errorMessage: 'Email invalide',
  custom: {
    options: async (value) => {
      const nom = value || '';
      if (!nom) return nom;
      try {
        const data = await Model.findOne({ where: { nom } });
        if (data) return Promise.reject('Cet utilisateur existe déjà');
        return nom;
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

const role = {
  in: ['body'],
  trim: true,
  isIn: ROLES,
  errorMessage: 'La valeur du champ role est inconrect'
};

module.exports = {
  create: {
    email,
    role,
  },
  update: {
    id: validationId(Model, NAMESPACE),
    email: {
      ...email,
      isEmail: {
        if: value => !!value
      },
    },
    role: {
      ...role,
      isIn: {
        if: value => !!value,
        options: ROLES
      }
    },
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
  getAll: {
    ...pagination()
  },
};
