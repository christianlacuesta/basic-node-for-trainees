const Sequelize = require('sequelize');
const sequelize = require('../../helpers/database');

const Items = sequelize.define('items', {
    itemId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    stepId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    interfaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    systemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    value: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    level: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    position: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    width: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    config: {
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
});

module.exports = Items;