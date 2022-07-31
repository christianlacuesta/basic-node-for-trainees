const Items = require('../../../models/item-models/item');


exports.getWorkflowItemForm = async(req, res, next) => {

    const validResponse = await validateParameters(req.body);

    if (validResponse.isValid) {

        const item = await getItems(validResponse);

        res.status(200).json(item);

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
            items: []
        }

        return {invalidItems: invalidItems, form: form, isValid: true};;
    }

}

const getItems = async(validResponse) => {

    const validResponseCopy = JSON.parse(JSON.stringify(validResponse));

    const itemsResponse = await Items.findAll({where: {
        organizationId: validResponseCopy.form.organizationId, 
        systemId: validResponseCopy.form.systemId,
        interfaceId: validResponseCopy.form.interfaceId,
        stepId: validResponseCopy.form.stepId
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

        items.push({itemData: itemData, objects: []});
    };

    validResponseCopy.form.Items = items;

    return validResponseCopy;

}