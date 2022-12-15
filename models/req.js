const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Req = sequelize.define('req', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      method: { 
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
      },
      path : {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
      }
});



module.exports = Req;