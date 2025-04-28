// const envConstants = require(`${__serverRoot}/constants`).envs;

const local = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'task-management',
  host: '127.0.0.1',
  dialect: 'postgres',
  port: 5432,
  logging: false
};

module.exports = local;
