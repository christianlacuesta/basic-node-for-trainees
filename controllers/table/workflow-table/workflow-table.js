
const Configs = require('../../../models/configs');
const WorkflowDatas = require('../../../models/workflow/workflow-data');
const WorkflowRecords = require('../../../models/workflow/workflow-record');


/*********************************************************************************************
 * A Dynamic Table creator that accepts a list of parameters and return it with table values *
 * for basic javascript data tables that has totals, paging, user defined columns and filter *
 *                                      So Above, As Below                                   *
 ********************************************************************************************/


exports.getTable = async(req, res, next) => {

    const validResponse = await validateParameters(req.body);

    if (validResponse.isValid) {

        const config = await getConfig(validResponse.table);

        const columnsResponse = await getColumns(validResponse, config);

        const rowsResponse = await getRows(columnsResponse, config);

        //console.log(columnsResponse)

        res.status(200).json(validResponse.table);
    } else {
        res.status(401).json({error: 'Invalid Parameters', invalidItems: validResponse.invalidItems});
    }

}

/********************************************************************************************
 * Validate required parameters and return a json response of the required item if invalid. *
 *******************************************************************************************/

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
    } else if (typeof tableParams.limit === 'undefined') {
        invalidItems.push('limit');
    } else if (typeof tableParams.offset === 'undefined') {
        invalidItems.push('offset');
    } else {
        invalidItems = [];
    }

    for (let i = 0; keys.length > i; i++) {
        if (tableParams[keys[i]] === null) {
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

        const selectedConfigs = configs[0].jsonData.filter(x => x.selected.code === 'yes');

        return selectedConfigs;
    })
    .catch(err => {
        return err
    });
}

const getColumns = (validResponse, config) => {

    const validResponseCopy = JSON.parse(JSON.stringify(validResponse));
    const configCopy = JSON.parse(JSON.stringify(config));

    configCopy.sort((a, b) => a.position > b.position ? -1 : 1);

    let newColumns = [];

    for (let i = 0; configCopy.length > i; i++) {
        newColumns.push(configCopy[i].label);
    }

    validResponseCopy.table.columns = newColumns;

    return validResponseCopy;
}

const getRows = (columnsResponse, config) => {

    const configCopy = JSON.parse(JSON.stringify(config));

    let newColumnNames = [];

    for (let i = 0; configCopy.length > i; i++) {
        newColumnNames.push(configCopy[i].name);
    }

    console.log(columnsResponse.table.filter)

    WorkflowDatas.findAll({
        attribute: ['recordId', 'interfaceId', 'systemId', 'organizationId', 'name', 'label', 'value'],
        where: {
        organizationId: columnsResponse.table.organizationId,
        systemId: columnsResponse.table.systemId,
        interfaceId: columnsResponse.table.interfaceId,
        name: newColumnNames
        },
        limit: columnsResponse.table.limit,
        offset: columnsResponse.table.offset,
        order: [[ 'workflowDataId', 'DESC' ]]
    })
    .then(workflowDatas => { 
        //console.log(workflowDatas)

    }).catch(err => {
        console.log(err)
    });

    // WorkflowRecords.findAndCountAll(tableConditions)
    // .then(workflowRecords => { 

    // })
    // .catch(err => {
    //     console.log(err)
    // });
}