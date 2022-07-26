const Configs = require('../../../models/admin-models/config-model/configs');

/**************************
* Common Filter function. *
**************************/

exports.commonFiltersFunction = (table) => {
    
    let commonWhereFilters = { 
        organizationId: table.organizationId,
        systemId: table.systemId,
        interfaceId: table.interfaceId,
        name: table.name
    };

    if (table.category) {
        Object.assign(commonWhereFilters, {category: table.category});

        delete commonWhereFilters.systemId;
        delete commonWhereFilters.interfaceId;

    }

    return commonWhereFilters;
}

/***********************************************************************************************************
* Function for getting the columns configuration of the table under config table with the column jsonData. *
***********************************************************************************************************/

exports.getConfig = async(table) => {

    const commonFilters = await this.commonFiltersFunction(table);

    return Configs.findAll({
        where: commonFilters,
    })
    .then(configs => { 

        const selectedConfigs = configs[0].jsonData.filter(x => x.selected.code === 'yes');

        return selectedConfigs;
    })
    .catch(err => {

        return err;

    });
}

/*******************************************************************************************
* Function for setting the columns and sorting them accosrding to their defined positions. *
*******************************************************************************************/

exports.getColumns = (validResponse, config) => {

    const validResponseCopy = JSON.parse(JSON.stringify(validResponse));
    const configCopy = JSON.parse(JSON.stringify(config));

    if (configCopy.length > 0) {

        configCopy.sort((a, b) => a.position > b.position ? -1 : 1);

    }

    let newColumns = [];

    for (let i = 0; configCopy.length > i; i++) {
        newColumns.push(configCopy[i]);
    }

    validResponseCopy.table.columns = newColumns;

    return validResponseCopy;
}