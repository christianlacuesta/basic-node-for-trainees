const Objects = require('../../../models/object-models/object');

exports.getWorkflowChoiceForm = async(req, res, next) => {

    const validResponse = await validateParameters(req.body);

    if (validResponse.isValid) {

        const choice = await getSubChoices(validResponse);

        res.status(200).json(choice);

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
            objectId: formParams.objectId,
            recordId: formParams.recordId,
            choices: []
        }

        return {invalidItems: invalidItems, form: form, isValid: true};;
    }

}

const getSubChoices = async(objectData) => {

    const choicesDataCopy = JSON.parse(JSON.stringify(objectData));

    const choicesResponse = await Objects.findAll({
        where: {
            organizationId: choicesDataCopy.organizationId? choicesDataCopy.organizationId : choicesDataCopy.form.organizationId, 
            objectParentId: choicesDataCopy.objectId? choicesDataCopy.objectId : choicesDataCopy.form.objectId,
        }
    })
    .then(choices => {
        return choices;
    })
    .catch(err => {
        return {error: err};
    });

    let choices = [];

    if (choicesResponse.length > 0) {
        for (let i = 0; choicesResponse.length > i; i++) {

            const choicesData = choicesResponse[i];
    
            choices.push({choicesData: choicesData, choices: []});
        }
    
    
        choicesDataCopy.form.choices = choices;
    }
    
    return choicesDataCopy;
}