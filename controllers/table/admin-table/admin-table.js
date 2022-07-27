
const Shared = require('../../../controllers/table/shared/shared');
const { Op, Sequelize } = require("sequelize");

/********************************************
 * Below is the list of Admin Table Models. *
 *******************************************/

const GroupModel = require('../../../models/admin-models/group-model/group');
const InterfaceModel = require('../../../models/admin-models/interface-model/interface');
const ItemModel = require('../../../models/admin-models/item-model/item');
const ObjectModel = require('../../../models/admin-models/object-model/object');
const OrganizationModel = require('../../../models/admin-models/organization-model/organization');
const SystemModel = require('../../../models/admin-models/system-model/system');
const UserModel = require('../../../models/admin-models/user-model/user');

/*********************************************************************************************
 * Controller for dynamically displaying the admin table based on user definition and return *
 * value to fill a javascript data table on the front end that has paging and filtering      *
 *            Author: Christian Lacuesta * Date: 7/26/2022 So Above, As Below                *
 ********************************************************************************************/

exports.getAdminTable = async(req, res, next) => {

    const validResponse = await validateParameters(req.body);

    if (validResponse.isValid) {

        const config = await Shared.getConfig(validResponse.table);

        const columnsResponse = await Shared.getColumns(validResponse, config);

        const tableResponse = await setAdminTable(columnsResponse);

        res.status(200).json(tableResponse);

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

    if (typeof tableParams.isOrganizationAdmin === 'undefined') {
        invalidItems.push('isOrganizationAdmin');
    } else if (typeof tableParams.organizationId === 'undefined') {
        invalidItems.push('organizationId');
    } else if (typeof tableParams.systemId === 'undefined') {
        invalidItems.push('systemId');
    } else if (typeof tableParams.interfaceId === 'undefined') {
        invalidItems.push('interfaceId');
    } else if (typeof tableParams.name === 'undefined') {
        invalidItems.push('name');
    } else if (typeof tableParams.category === 'undefined') {
        invalidItems.push('category');
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
            isOrganizationAdmin: tableParams.isOrganizationAdmin,
            organizationId: tableParams.organizationId, 
            systemId: tableParams.systemId,
            interfaceId: tableParams.interfaceId,
            name: tableParams.name,
            category: tableParams.category,
            limit: tableParams.limit,
            offset: tableParams.offset,
            columns: [],
            filters: tableParams.filters,
            totalRows: null,
            rows: [],
        }

        return {invalidItems: invalidItems, table: table, isValid: true};
    }
}

/********************************************************
 * Function to set the model by user defined parameter. *
 *******************************************************/

const setAdminTable = async(columnsResponse) => {

    const columnsResponseCopy = JSON.parse(JSON.stringify(columnsResponse));

   let table;

   if (columnsResponse.table.category.toLowerCase() === 'group') {

        table = GroupModel;

   } else if (columnsResponse.table.category.toLowerCase() === 'interface') {

        table = InterfaceModel;

   } else if (columnsResponse.table.category.toLowerCase() === 'item') {

        table = ItemModel;

   } else if (columnsResponse.table.category.toLowerCase() === 'object') {

        table = ObjectModel;

   } else if (columnsResponse.table.category.toLowerCase() === 'organization') {

        table = OrganizationModel;

   } else if (columnsResponse.table.category.toLowerCase() === 'system') {

        table = SystemModel;

   } else if (columnsResponse.table.category.toLowerCase() === 'user') {

        table = UserModel;

   }

   const rowResponse = await getRows(table, columnsResponse);

   Object.assign(columnsResponseCopy.table, {totalRows: rowResponse.count, rows: rowResponse.rows});

   return columnsResponseCopy;

}

/***************************************************************
 * Accepts columnsResponse then outputs the rows of the model. *
 **************************************************************/

const getRows = async(table, columnsResponse) => {

    const filters = await setFilters(columnsResponse);

    return table.findAndCountAll({where: filters}).then(records => { 
        return records
    });

}

/*******************************************************************
 * Sets the filter if there are any and returns the filter object. *
 ******************************************************************/

const setFilters = (columnsResponse) => {

    let filters = {};

    if (columnsResponse.table.filters.length > 0) {

        for (let i = 0; columnsResponse.table.filters.length > i; i++) {

            const key = Object.keys(columnsResponse.table.filters[i]);

            const type = columnsResponse.table.filters[i][key[0]].type;

            const value = columnsResponse.table.filters[i][key[0]].value;

            if (type === 'text') {

                Object.assign(filters, {[key[0]]: {[Op.like]: Sequelize.literal('UPPER(' + '\'%'+ value +'%\'' + ')')}});

            } else if (type === 'date') {

                Object.assign(filters, {[key[0]]: {[Op.between]: [value.dateFrom, value.dateTo]}});

            } else if (type === 'array') {

                Object.assign(filters, {[key[0]]: {name: columnsResponse.table.filters[i][key[0]].arrayFilter.name}});
                
            }

        }

    }

    return filters;

}
