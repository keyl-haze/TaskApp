const secrets = require(`${__serverRoot}/secrets/${__env}`).database
  .taskManagement;

const config = {
  local: {
    username: secrets.username,
    password: secrets.password,
    database: 'taskManagement',
    host: '127.0.0.1',
    dialect: 'postgres',
    port: 5432,
    logging: false
  }
};

module.exports = config[__env];
