const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    username: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
        unique : true
      },
    admin : {
      type : Sequelize.BOOLEAN,
      required: true,
    },
    email: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
      unique : true
    },
    password :{
        type : Sequelize.STRING,
        allowNull: false
        },
});



module.exports = User;