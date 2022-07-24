
const Configs = require('../../../models/configs');
const WorkflowDatas = require('../../../models/workflow/workflow-data');
const WorkflowRecords = require('../../../models/workflow/workflow-record');


exports.getTable = async(req, res, next) => {

    const validResponse = await validateParameters(req.body);

    if (validResponse.isValid) {

        const config = await getConfig(validResponse.table);

        console.log(config)

        res.status(200).json(validResponse.table);
    } else {
        res.status(401).json({error: 'Invalid Parameters'});
    }


}


const validateParameters = (table) => {

    let invalidItems = [];

    const keys = Object.keys(table);

    

    for (let i = 0; keys.length > i; i++) {
        if (!table[keys[i]]) {
            invalidItems.push(keys[i]);
        }
    }

    if (invalidItems.length > 0) {

        const table = {
            organizationId: table.organizationId, 
            systemId: table.systemId,
            interfaceId: table.interfaceId,
            limit: table.limit,
            offset: tableoffset,
            filters: table.filters,
            name: table.name,
            totalRows: null,
            rows: [],
            columns: [],
        }

        return {invalidItems: invalidItems, table: null, isValid: false};
    } else {
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