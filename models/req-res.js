const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const ReqRes = sequelize.define('reqRes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      type: { // true is open  false is close
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
      },
      api : {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
      },
      status: { // true is open  false is close
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



module.exports = ReqRes;