const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs-extra');

const directories = require('./directories');

fs.ensureDirSync(directories.data);

var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: false,
  // SQLite only
  storage: path.join(directories.data, 'data.sqlite')
});

module.exports = sequelize;
