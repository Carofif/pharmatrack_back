const dotenv = require('dotenv');

dotenv.config();

const SERVER_HOST_NAME = process.env.HOST || 'localhost';
const SERVER_PORT = process.env.PORT || 1337;

const SERVER = {
  hostname: SERVER_HOST_NAME,
  port: SERVER_PORT,
  secretCode: process.env.SECRET_SU,
  secretToken: process.env.SECRET_TOKEN,
};

const DB = {
  DEV_DB:  process.env.DEV_DB,
  DATABASE_URL:  process.env.DATABASE_URL,
};

const UPLOAD = {
  config: { createParentPath: true },
  repositoryName: 'uploads',
};


const config = {
  server: SERVER,
  db: DB,
  env: process.env.NODE_ENV || 'development',
  upload: UPLOAD
};

module.exports = config;
