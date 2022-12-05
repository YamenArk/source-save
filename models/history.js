const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const History = sequelize.define('history', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      status: { // true is open  false is close
        type: Sequelize.BOOLEAN,
        required: true,
        allowNull: false,
      },
      userId : {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fileeId : {
        type: Sequelize.INTEGER,
        allowNull: false,
      }   
});



module.exports = History;