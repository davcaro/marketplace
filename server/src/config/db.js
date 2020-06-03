require('dotenv').config();
const {
  ENV: { DB }
} = require('./index');

module.exports = {
  development: {
    username: DB.username,
    password: DB.password,
    database: DB.database,
    host: DB.host,
    port: DB.port,
    dialect: 'postgres'
  }
};
