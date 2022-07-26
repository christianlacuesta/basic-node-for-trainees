const Sequelize = require('sequelize');
const sequelize = require('../../../helpers/database');

const Organizations = sequelize.define('organizations', {
    organizationId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    industry: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    logo: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    accessType: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    activeDirectoryUrl: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    reportServerUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    config: {
        type: Sequelize.JSON,
        allowNull: true,
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
});

module.exports = Organizations;