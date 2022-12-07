const Sequelize = require('sequelize');

const sequelize = new Sequelize('SourceSafe', 'root', '', {
  dialect: 'mysql',
  host: process.env.HOST
});

module.exports = sequelize;
