const express = require('express');
const router = express.Router();
const workflowTableController = require('../../../controllers/table/workflow-table/workflow-table');

router.post('/workflowtable/getworkflowtable', [], workflowTableController.getWorkflowTable);

module.exports = router;