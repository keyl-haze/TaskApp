require('../globals');

const config = {
  local: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    logging: false,
    dialectOptions: {
      ssl:{
        require: true,
        rejectUnauthorized: false,
      },
    },
    use_env_variable: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    logging: false,
    dialectOptions: {
      ssl:{
        require: true,
        rejectUnauthorized: false,
      },
    },
    use_env_variable: false,}
};

module.exports = config[__env];
