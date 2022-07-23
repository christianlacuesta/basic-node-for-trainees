const Sequelize = require('sequelize');
const sequelize = require('../../helpers/database');

const WorkflowRecords = sequelize.define('workflowrecords', {
    recordId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    interfaceId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    systemId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    organizationId:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    activeStep: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastActiveStep: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    stepStatus: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    fileStatus: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isEmployee: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    isSupervisor: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    isManager: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    isSubmitted: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    jsonData: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    fileData: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    objectData: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    deleteFlag: {
        type: Sequelize.STRING,
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

module.exports = WorkflowRecords;