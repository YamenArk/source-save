const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Res = sequelize.define('res', {
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
      },
      status: {
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false,
      },
      username : {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
      },
      message : {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
      }
});



module.exports = Res;