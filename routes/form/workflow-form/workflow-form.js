const express = require('express');
const router = express.Router();
const workflowFormController = require('../../../controllers/form/workflow-form/workflow-form');
const workflowStepFormController = require('../../../controllers/form/workflow-form/workflow-step-form');
const workflowItemFormController = require('../../../controllers/form/workflow-form/workflow-item-form');
const workflowObjectFormController = require('../../../controllers/form/workflow-form/workflow-object-form');
const workflowChoiceFormController = require('../../../controllers/form/workflow-form/workflow-choice-form');

router.post('/workflowform/getworkflowform', [], workflowFormController.getWorkflowForm);

router.post('/workflowform/getstepform', [], workflowStepFormController.getWorkflowStepForm);

router.post('/workflowform/getitemform', [], workflowItemFormController.getWorkflowItemForm);

router.post('/workflowform/getobjectform', [], workflowObjectFormController.getWorkflowObjectForm);

router.post('/workflowform/getchoiceform', [], workflowChoiceFormController.getWorkflowChoiceForm);

module.exports = router;