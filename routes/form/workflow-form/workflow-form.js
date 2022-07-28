const express = require('express');
const router = express.Router();
const workflowFormController = require('../../../controllers/form/workflow-form/workflow-form');

router.post('/workflowform/workflowform', [], workflowFormController.getWorkflowForm);

module.exports = router;