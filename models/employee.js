const Sequelize = require('sequelize');
const sequelize = require('../helpers/database');

const Employee = sequelize.define('employee', {
    idNo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    job: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    comments: {
        type: Sequelize.JSON,
        allowNull: false,
    },
});

module.exports = Employee;