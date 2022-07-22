
const Configs = require('../models/configs');
const WorkflowDatas = require('../../models/workflow/workflow-data');
const WorkflowRecords = require('../../models/workflow/workflow-records');


exports.getTable = (req, res, next) => {

    const table = {
        organizationId: req.body.organizationId, 
        systemId: req.body.systemId,
        interfaceId: req.body.interfaceId,
        limit: req.body.limit,
        offset: req.body.offset,
        filters: req.body.filters,
        name: null,
        totalRows: null,
        rows: [],
        columns: [],
    }

    res.status(200).json(table);
}

const getColumnsConfig = () => {

}

const getRows = () => {

}