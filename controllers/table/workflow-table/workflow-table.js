
const Configs = require('../../../models/configs');
const WorkflowDatas = require('../../../models/workflow/workflow-data');
const WorkflowRecords = require('../../../models/workflow/workflow-record');


/*********************************************************************************************
 * A Dynamic Table creator that accepts a list of parameters and return it with table values *
 ********************************************************************************************/


exports.getTable = async(req, res, next) => {

    const validResponse = await validateParameters(req.body);

    if (validResponse.isValid) {

        const config = await getConfig(validResponse.table);

        console.log(config)

        res.status(200).json(validResponse.table);
    } else {
        res.status(401).json({error: 'Invalid Parameters', invalidItems: validResponse.invalidItems});
    }


}


const validateParameters = (tableParams) => {

    let invalidItems = [];

    const keys = Object.keys(tableParams);

    if (typeof tableParams.organizationId === 'undefined') {
        invalidItems.push('organizationId');
    } else if (typeof tableParams.systemId === 'undefined') {
        invalidItems.push('systemId');
    } else if (typeof tableParams.interfaceId === 'undefined') {
        invalidItems.push('interfaceId');
    } else if (typeof tableParams.name === 'undefined') {
        invalidItems.push('name');
    } else if (typeof tableParams.name === 'undefined') {
        invalidItems.push('name');
    } else if (typeof tableParams.name === 'undefined') {
        invalidItems.push('name');
    }

    for (let i = 0; keys.length > i; i++) {
        if (!tableParams[keys[i]]) {
            invalidItems.push(keys[i]);
        }
    }

    if (invalidItems.length > 0) {

        return {invalidItems: invalidItems, table: null, isValid: false};

    } else {

        const table = {
            organizationId: tableParams.organizationId, 
            systemId: tableParams.systemId,
            interfaceId: tableParams.interfaceId,
            limit: tableParams.limit,
            offset: tableParams.offset,
            filters: tableParams.filters,
            name: tableParams.name,
            totalRows: null,
            rows: [],
            columns: [],
        }

        return {invalidItems: invalidItems, table: table, isValid: true};;
    }

}

const getConfig = (table) => {
    return Configs.findAll({
        where: { 
            organizationId: table.organizationId,
            systemId: table.systemId,
            interfaceId: table.interfaceId,
            name: table.name
        },
    })
    .then(configs => { 

        const selectedConfigs = configs[0].jsonData.filter(x => x.isSelected === true);

        return selectedConfigs;
    })
    .catch(err => {
        return err
    });
}

const getRows = () => {

}