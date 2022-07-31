const Steps = require('../../../models/step-models/step');
const Items = require('../../../models/item-models/item');
const Objects = require('../../../models/object-models/object');


const stepData = {
    recordId: null,
    interfaceId: null,
    systemId: null,
    organizationId: null,
    activeStep: null,
    lastActiveStep: null,
    stepStatus: null,
    fileStatus: null,
    isEmployee: null,
    isSupervisor: null,
    isManager: null,
    isSubmitted: null,
    jsonData: null,
    fileData: null,
    objectData: null,
    deleteFlag: null,
    createdById: null,
    createdByName: null,
    updatedById: null,
    updatedByName: null,
    createdAt: null,
    updatedAt: null
};

const itemData = {
    itemId: null,
    stepId: null,
    interfaceId: null,
    systemId: null,
    organizationId: null,
    name: null,
    description: null,
    value: null,
    type: null,
    level: null,
    position: null,
    width: null,
    config: null,
    createdById: null,
    createdByName: null,
    updatedById: null,
    updatedByName: null,
    createdAt: null,
    updatedAt: null
};

const objectData = {
    objectId: null,
    objectParentId: null,
    level: null,
    itemId: null,
    organizationId: null,
    name: null,
    description: null,
    label: null,
    value: null,
    type: null,
    comment: null,
    commentType: null,
    choices: null,
    isMultiple: null,
    defaultSelected: null,
    isRequired: null,
    isSelected: null,
    config: null,
    createdById: null,
    createdByName: null,
    updatedById: null,
    updatedByName: null,
    createdAt: null,
    updatedAt: null
};


exports.getWorkflowForm = async(req, res, next) => {

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
            steps: [{
                stepData: stepData,
                items: [
                    {
                        itemData: itemData,
                        objects: [objectData]
                    }
                ],
            }]
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

        const items = await getItems(stepData);

        validResponseCopy.form.steps.push({stepData: stepData, items: items});
    }

    return validResponseCopy;

}
 
const getItems = async(stepData) => {

    const stepCopy = JSON.parse(JSON.stringify(stepData));

    const itemsResponse = await Items.findAll({where: {
        organizationId: stepCopy.organizationId, 
        systemId: stepCopy.systemId,
        interfaceId: stepCopy.interfaceId,
        stepId: stepCopy.stepId
    }})
    .then(items => {
        return items;
    })
    .catch(err => {
        return {recordIdList: recordIdList, records: workflowDatas, error: null};
    });

    let items = [];

    for (let i = 0; itemsResponse.length > i; i++) {

        const itemData = itemsResponse[i];

        const objects = await getObjects(itemData);

        items.push({itemData: itemData, objects: objects});
    };


    return items;

}

const getObjects = async(itemData) => {

    const itemCopy = JSON.parse(JSON.stringify(itemData));

    const objectsResponse = await Objects.findAll({where: {
        organizationId: itemCopy.organizationId, 
        objectId: itemCopy.value.objectId,
    }})
    .then(objects => {
        return objects;
    })
    .catch(err => {
        return {error: err};
    });

    let objects = [];

    for (let i = 0; objectsResponse.length > i; i++) {

        const objectData = objectsResponse[i];

        const choices = await getSubChoices(objectData);

        objects.push({objectData: objectData, choices: choices});
    }

    return objects;
}

const getSubChoices = async(objectData) => {

    const objectDataCopy = JSON.parse(JSON.stringify(objectData));

    const choicesResponse = await Objects.findAll({where: {
        organizationId: objectDataCopy.organizationId, 
        objectParentId: objectDataCopy.objectId,
    }})
    .then(objects => {
        return objects;
    })
    .catch(err => {
        return {error: err};
    });

    let choices = [];

    for (let i = 0; choicesResponse.length > i; i++) {

        const choicesData = choicesResponse[i];

        const subChoices = await getSubChoices(choicesResponse[i]);

        choices.push({choicesData: choicesData, choices: subChoices});
    }

    return choices;
}