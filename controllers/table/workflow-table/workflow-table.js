
const Configs = require('../../../models/configs');
const WorkflowDatas = require('../../../models/workflow/workflow-data');
const WorkflowRecords = require('../../../models/workflow/workflow-record');


exports.getTable = async(req, res, next) => {

    const table = {
        organizationId: req.body.organizationId, 
        systemId: req.body.systemId,
        interfaceId: req.body.interfaceId,
        limit: req.body.limit,
        offset: req.body.offset,
        filters: req.body.filters,
        name: req.body.name,
        totalRows: null,
        rows: [],
        columns: [],
    }

    const config = await getConfig(table);

    console.log(config)

    const isValid = await validateParameters(table);

    if (isValid) {
        res.status(200).json(table);
    } else {
        res.status(401).json({error: 'Invalid Parameters'});
    }


}


const validateParameters = (table) => {

    const keys = Object.keys(table);

    let invalidItems = [];

    for (let i = 0; keys.length > i; i++) {
        if (!table[keys[i]]) {
            invalidItems.push(keys[i]);
        }
    }
    console.log(invalidItems)
    if (invalidItems.length > 0) {
        return false;
    } else {
        return true;
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
        
        return configs[0].jsonData;
    })
    .catch(err => {
        return err
    });
}

const getRows = () => {

}