const Steps = require('../../../models/step-models/step');


exports.getWorkflowStepForm = async(req, res, next) => {

    const validResponse = await validateParameters(req.body);

    if (validResponse.isValid) {

        const step = await getSteps(validResponse);

        res.status(200).json(step);

    } else {

        res.status(401).json({error: 'Invalid Parameters', invalidItems: validResponse.invalidItems});

    }
  
}

const validateParameters = (formParams) => {

    let invalidItems = [];

    const keys = Object.keys(formParams);

    if (typeof formParams.organizationId === 'undefined') {
        invalidItems.push('organizationId');
    } else if (typeof formParams.systemId === 'undefined') {
        invalidItems.push('systemId');
    } else if (typeof formParams.interfaceId === 'undefined') {
        invalidItems.push('interfaceId');
    } else {
        invalidItems = [];
    }

    for (let i = 0; keys.length > i; i++) {
        if (formParams[keys[i]] === null) {
            invalidItems.push(keys[i]);
        }
    }

    if (invalidItems.length > 0) {

        return {invalidItems: invalidItems, form: null, isValid: false};

    } else {

        const form = {
            organizationId: formParams.organizationId, 
            systemId: formParams.systemId,
            interfaceId: formParams.interfaceId,
            stepId: formParams.stepId,
            recordId: formParams.recordId,
            steps: []
        }

        return {invalidItems: invalidItems, form: form, isValid: true};;
    }

}

const getSteps = async(validResponse) => {

    const validResponseCopy = JSON.parse(JSON.stringify(validResponse));

    const steps = await Steps.findAll({where: {
        organizationId: validResponse.form.organizationId, 
        systemId: validResponse.form.systemId,
        interfaceId: validResponse.form.interfaceId,
    }})
    .then(steps => {
        return steps;
    })
    .catch(err => {
        return {recordIdList: recordIdList, records: workflowDatas, error: null};
    });

    validResponseCopy.form.steps = [];

    for (let i = 0; steps.length > i; i++) {

        const stepData = steps[i];

        validResponseCopy.form.steps.push({stepData: stepData, items: []});
    }

    return validResponseCopy;

}