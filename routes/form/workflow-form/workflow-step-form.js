const express = require('express');
const router = express.Router();
const workflowStepFormController = require('../../../controllers/form/workflow-form/workflow-step-form');

router.post('/workflowstepform/getstepform', [], workflowStepFormController.getWorkflowStepForm);

module.exports = router;