const Objects = require('../../../models/object-models/object');

exports.getWorkflowObjectForm = async(req, res, next) => {

    const validResponse = await validateParameters(req.body);

    if (validResponse.isValid) {

        const object = await getObjects(validResponse);

        res.status(200).json(object);

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
            objects: []
        }

        return {invalidItems: invalidItems, form: form, isValid: true};;
    }

}

const getObjects = async(itemData) => {

    const itemCopy = JSON.parse(JSON.stringify(itemData));

    const objectsResponse = await Objects.findAll({
        where: {
            organizationId: itemCopy.form.organizationId, 
            objectId: itemCopy.form.objectId,
        }
    })
    .then(objects => {
        return objects;
    })
    .catch(err => {
        return {error: err};
    });

    let objects = [];

    for (let i = 0; objectsResponse.length > i; i++) {

        const objectData = objectsResponse[i];

        objects.push({objectData: objectData, choices: []});
    }

    return objects;
}