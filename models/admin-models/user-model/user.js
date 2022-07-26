const Sequelize = require('sequelize');
const sequelize = require('../../../helpers/database');

const Users = sequelize.define('users', {
    userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    accessType: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    title: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    middleName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nationalId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    companyId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    medicalId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    doctorId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    driverId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    proffessionId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    studentId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    gender: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    nationality: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    organization: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    department: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    section: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    position: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    mobile: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    photo: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    createdById: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdByName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    updatedById: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    updatedByName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    permission: {
        type: Sequelize.JSON,
        allowNull: false,
    },
});

module.exports = Users;