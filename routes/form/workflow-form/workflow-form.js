const express = require('express');
const router = express.Router();
const workflowFormController = require('../../../controllers/form/workflow-form/workflow-form');

router.post('/workflowform/getworkflowform', [], workflowFormController.getWorkflowForm);

module.exports = router;