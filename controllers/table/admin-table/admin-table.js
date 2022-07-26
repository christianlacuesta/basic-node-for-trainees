
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
        console.log(columnsResponse)

        res.status(200).json(validResponse);

    } else {

        res.status(401).json({error: 'Invalid Parameters', invalidItems: validResponse.invalidItems});

    }

}

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
            limit: tableParams.limit,
            offset: tableParams.offset,
            columns: [],
            filters: [],
            totalRows: null,
            rows: [],
        }

        return {invalidItems: invalidItems, table: table, isValid: true};;
    }
}

const setAdminTable = () => {

}

const getRows = () => {

}