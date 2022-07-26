


/**************************
* Common Filter function. *
**************************/

exports.commonFiltersFunction = (table) => {
    const commonWhereFilters = { 
        organizationId: table.organizationId,
        systemId: table.systemId,
        interfaceId: table.interfaceId,
        name: table.name
    };

    return commonWhereFilters;
}