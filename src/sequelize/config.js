const config = require('../config');

module.exports = {
  development: {
    url: config.db.DEV_DB,
    dialect: 'postgres',
  },
  production: {
    url: config.db.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
  }
};