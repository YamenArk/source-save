const Sequelize = require('sequelize');
const logger = require('./logger')
const sequelize = new Sequelize('SourceSafe', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
  logging : (message) =>{logger.info(message)}
});

module.exports = sequelize;
