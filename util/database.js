const Sequelize = require('sequelize');

const sequelize = new Sequelize('SourceSafe', 'root', '', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
