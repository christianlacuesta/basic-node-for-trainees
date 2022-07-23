const express = require('express');
const router = express.Router();
const workflowTableController = require('../../../controllers/table/workflow-table/workflow-table');

router.post('/workflowtable/gettable', [], workflowTableController.getTable);

module.exports = router;