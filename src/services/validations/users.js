const { roles } = require('../../config/user');
const { User } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { pagination } = require('./general');

const NAMESPACE = 'USER_VALIDATION';
const Model = User;

const email = {
  in: ['body'],
  isEmail: true,
  errorMessage: 'Email invalide',
  custom: {
    options: async (value) => {
      const nom = value || '';
      try {
        const data = await Model.findOne({ where: { nom } });
        if (data) return Promise.reject('Cet email existe déjà');
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

const role = {
  in: ['body'],
  isIn: [roles.aucun, roles.pharmacien, roles.employe],
  errorMessage: 'La valeur du champ role est inconrect'
};

module.exports = {
  create: {
    email,
    role,
  },
  getAll: {
    ...pagination()
  },
};
