const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Filee = sequelize.define('filee', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    name : {
      type: Sequelize.STRING,
      allowNull: false,
      unique : true
    },
    fileUrl : {
      type: Sequelize.STRING,
      allowNull: false
      },
    status: { // true is open  false is close
      type: Sequelize.BOOLEAN,
      required: true,
      allowNull: false,
    },
    checkInUserId : {
      type: Sequelize.INTEGER,
      allowNull: true,
    },   
    createdUserId : {
      type: Sequelize.INTEGER,
      allowNull: false,
    },   
    groupId : {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
});



module.exports = Filee;