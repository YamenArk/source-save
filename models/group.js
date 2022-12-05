const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Group = sequelize.define('group', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    name: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
        unique : true
      },
    admin : {
      type: Sequelize.INTEGER,
      required: true,
      allowNull: false,
    }
});



module.exports = Group;