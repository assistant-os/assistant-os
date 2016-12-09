const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs-extra');

var folders = {
    data: path.join(__dirname, '../../data')
};

fs.ensureDirSync(folders.data);

var sequelize = new Sequelize('editor', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: false,
  // SQLite only
  storage: path.join(folders.data, 'data.sqlite')
});

module.exports = sequelize;
