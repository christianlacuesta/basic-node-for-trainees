const Sequelize = require('sequelize');
const sequelize = require('../../../helpers/database');

const Systems = sequelize.define('systems', {
    systemId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    organizationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    type: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    theme: {
        type: Sequelize.JSON,
        allowNull: false,
    },      
    logo: {
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

module.exports = Systems;