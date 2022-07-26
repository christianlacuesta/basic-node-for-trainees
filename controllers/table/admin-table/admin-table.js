
const Configs = require('../../../models/admin-models/config-model/configs');

/********************************************
 * Below is the list of Admin Table Models. *
 *******************************************/

const Group = require('../../../models/admin-models/group-model/group');
const Interface = require('../../../models/admin-models/interface-model/interface');
const Item = require('../../../models/admin-models/item-model/item');
const Object = require('../../../models/admin-models/object-model/object');
const Organization = require('../../../models/admin-models/organization-model/organization');
const System = require('../../../models/admin-models/system-model/system');
const User = require('../../../models/admin-models/user-model/user');

const table = {
    tableName: null,
    columns: [],
    filters: [],
    limit: null,
    offset: null,
    totalRows: null,
    rows: [],
}

exports.getAdminTable = async(req, res, next) => {

}

const validateParameters = () => {

}

const setAdminTable = () => {

}

const getConfig = () => {

}

const getRows = () => {

}