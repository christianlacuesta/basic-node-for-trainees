
const Configs = require('../../../models/configs');
const WorkflowDatas = require('../../../models/workflow/workflow-data');
const WorkflowRecords = require('../../../models/workflow/workflow-record');
const { Op, Sequelize } = require("sequelize");


/*********************************************************************************************
 * A Dynamic Table creator that accepts a list of parameters and return it with table values *
 * for basic javascript data tables that has totals, paging, user defined columns and filter *
 *            Author: Christian Lacuesta * Date: 7/26/2022 So Above, As Below                *
 ********************************************************************************************/


exports.getWorkflowTable = async(req, res, next) => {

    const validResponse = await validateParameters(req.body);

    if (validResponse.isValid) {

        const config = await getConfig(validResponse.table);

        const columnsResponse = await getColumns(validResponse, config);

        const rowsResponse = await getRows(columnsResponse, config);

        res.status(200).json(rowsResponse);

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

/**************************
* Common Filter function. *
**************************/

const commonFiltersFunction = (table) => {
    const commonWhereFilters = { 
        organizationId: table.organizationId,
        systemId: table.systemId,
        interfaceId: table.interfaceId,
        name: table.name
    };

    return commonWhereFilters;
}

/***********************************************************************************************************
* Function for getting the columns configuration of the table under config table with the column jsonData. *
***********************************************************************************************************/

const getConfig = async(table) => {

    const commonFilters = await commonFiltersFunction(table);

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

/****************************************
* Function for getting the table rows . *
****************************************/

const getRows = async(columnsResponse, config) => {

    const columnsResponseCopy = JSON.parse(JSON.stringify(columnsResponse));
    const configCopy = JSON.parse(JSON.stringify(config));

    let filterKeys = [];

    for (let i = 0; columnsResponse.table.filters.length > i; i++) {
        const objKeys = Object.keys(columnsResponse.table.filters[i]);
        filterKeys.push(...objKeys);
    }

    const commonFilters = await commonFiltersFunction(columnsResponse.table);

    let whereCondition = commonFilters;

    let newColumnNames = [];
    let recordIdList = [];
    let recordsArray = [];

    if (filterKeys.length > 0) {

        const recordListResponse = await getRecordIdList(columnsResponse, filterKeys);

        recordIdList = recordListResponse.recordIdArray;
        newColumnNames = recordListResponse.newColumnNames;
        recordsArray = recordListResponse.records;

    } else {

        for (let i = 0; configCopy.length > i; i++) {
            newColumnNames.push(configCopy[i].name);
        }

        Object.assign(whereCondition, {name: newColumnNames});


    }

    const workflowRecords = await getWorkflowRecords(columnsResponse, recordIdList,  recordsArray);

    Object.assign(columnsResponseCopy.table, {rows: workflowRecords.workflowRecordsData.rows, totalRows: workflowRecords.workflowRecordsData.count});

    return columnsResponseCopy;

}

/********************************************************************************************************************************
* Function for getting the workflow records and iterating the filedata array as columns depending on the columns configuration. *
********************************************************************************************************************************/

const getWorkflowRecords = async(columnsResponse, recordIdList,  recordsArray) => {

    let commonFilters = await commonFiltersFunction(columnsResponse.table);
    delete commonFilters.name;

    if (recordIdList.length > 0) { Object.assign(commonFilters, {recordId: recordIdList}) };

    for (let i = 0; columnsResponse.table.filters.length > i; i++) {

        const key = Object.keys(columnsResponse.table.filters[i])[0];

        if (key === 'recordId') {

            Object.assign(commonFilters, {recordId: {[Op.like]: Sequelize.literal('UPPER(' + '\'%'+ columnsResponse.table.filters[i][key].value +'%\'' + ')')}});

        } else if (key === 'activeStep') {

            const filterObj = {[key]: columnsResponse.table.filters[i][key].arrayFilter.name };

            Object.assign(commonFilters, filterObj);

        } else if (key === 'stepStatus') { 

            const filterObj = {[key]: { name: columnsResponse.table.filters[i][key].arrayFilter.name } };

            Object.assign(commonFilters, filterObj);

        } else if (key === 'createdAt') {

            const filterObj = {[Op.and]: [
                { [Op.gte]: new Date(columnsResponse.table.filters[i][key].value.dateFrom).setUTCHours(0,0,0,0) + (3600 * 1000 * 24)} , 
                { [Op.lte]: new Date(columnsResponse.table.filters[i][key].value.dateTo).setUTCHours(23,59,59,999) + (3600 * 1000 * 24)} 
            ]};

            Object.assign(commonFilters, {[key]: filterObj});

        } else if (key === 'updatedAt') {

            const filterObj = {[Op.and]: [
                { [Op.gte]: new Date(columnsResponse.table.filters[i][key].value.dateFrom).setUTCHours(0,0,0,0) + (3600 * 1000 * 24)} , 
                { [Op.lte]: new Date(columnsResponse.table.filters[i][key].value.dateTo).setUTCHours(23,59,59,999) + (3600 * 1000 * 24)} 
            ]};

            Object.assign(commonFilters, {[key]: filterObj});

        }

    }
    return WorkflowRecords.findAndCountAll({
        where: commonFilters,
        limit: columnsResponse.table.limit,
        offset: columnsResponse.table.offset,
        order: [ [ 'recordId', 'DESC' ]],
    })
    .then(workflowRecords => { 

        let rows = JSON.parse(JSON.stringify(workflowRecords.rows));

        rows.forEach(function(x){delete x.fileData});

        let workflowRecordsData = {
            count: workflowRecords.count,
            rows: rows,
            fileDataHeaders: []
        };

        for (let i = 0; workflowRecords.rows.length > i; i++) {
            if (workflowRecords.rows[i].fileData.length > 0) {
                for (let j = 0; workflowRecords.rows[i].fileData.length > j; j++) {
                    if (workflowRecords.rows[i].fileData[j].value) {
                        Object.assign(workflowRecordsData.rows[i], {[workflowRecords.rows[i].fileData[j].name]: workflowRecords.rows[i].fileData[j].value});
                        workflowRecordsData.fileDataHeaders.push(workflowRecords.rows[i].fileData[j].name);
                    }
                }
            }
        }


        return {workflowRecordsData: workflowRecordsData, error: null};

    })
    .catch(err => {

        return {workflowRecordsData: null, error: err};

    });

}

/***********************************************************
* Get the record ids of filtered items from workflow data. *
***********************************************************/

const getRecordIdList = async(columnsResponse, filterKeys) => {
    let newColumnNames = [];
    let recordIdArray = [];
    let recordsArray = [];

    for (let i = 0; filterKeys.length > i; i++) {

        newColumnNames.push(filterKeys[i]);

        if (filterKeys[i] && columnsResponse.table.filters[i][filterKeys[i]].type === 'text' && columnsResponse.table.filters[i][filterKeys[i]].value) {
                        
            const recordIdArrayPromise = await getRecordDataString(columnsResponse, filterKeys[i], columnsResponse.table.filters[i][filterKeys[i]].value);

            recordIdArray = [...recordIdArray, ...recordIdArrayPromise.recordIdList];
            recordsArray = [...recordIdArray, ...recordIdArrayPromise.records];
        }

        if (filterKeys[i] && columnsResponse.table.filters[i][filterKeys[i]].type === 'number' && columnsResponse.table.filters[i][filterKeys[i]].value) {

            const recordIdArrayPromise = await getRecordDataString(columnsResponse, filterKeys[i], columnsResponse.table.filters[i][filterKeys[i]].value);

            recordIdArray = [...recordIdArray, ...recordIdArrayPromise.recordIdList];
            recordsArray = [...recordIdArray, ...recordIdArrayPromise.records];

        }

        if (filterKeys[i] && columnsResponse.table.filters[i][filterKeys[i]].type === 'date' && columnsResponse.table.filters[i][filterKeys[i]].value) {

            const recordIdArrayPromise = await getRecordDataDate(columnsResponse, filterKeys[i], 
                new Date(columnsResponse.table.filters[i][filterKeys[i]].value.dateFrom).setUTCHours(0,0,0,0) + (3600 * 1000 * 24),
                new Date(columnsResponse.table.filters[i][filterKeys[i]].value.dateTo).setUTCHours(23,59,59,999) + (3600 * 1000 * 24));

            recordIdArray = [...recordIdArray, ...recordIdArrayPromise.recordIdList];
            recordsArray = [...recordIdArray, ...recordIdArrayPromise.records];

        }

        if (filterKeys[i] && columnsResponse.table.filters[i][filterKeys[i]].type === 'array' && columnsResponse.table.filters[i][filterKeys[i]].arrayFilter) {

            const recordIdArrayPromise = await getRecordDataArray(columnsResponse, filterKeys[i], columnsResponse.table.filters[i][filterKeys[i]].arrayFilter.name);

            recordIdArray = [...recordIdArray, ...recordIdArrayPromise.recordIdList];
            recordsArray = [...recordIdArray, ...recordIdArrayPromise.records];

        }

    }

    recordIdArray.sort((a, b) => a > b ? -1 : 1);

    return {recordIdArray: recordIdArray, newColumnNames: newColumnNames, records: recordsArray};

}

/***********************************************
* Filter Functions Date, String, Number Array. *
***********************************************/

const workflowFilterAttributes = ['workflowDataId', 'recordId', 'interfaceId', 'systemId', 'organizationId', 'name', 'label', 'value', 'type'];

const getRecordDataString = async(columnsResponse, name, value) => {

    let commonFilters = await commonFiltersFunction(columnsResponse.table);
    Object.assign(commonFilters, {name: name, value: {[Op.like]: Sequelize.literal('UPPER(' + '\'%'+ value +'%\'' + ')')}});

    return WorkflowDatas.findAll({
        attributes: workflowFilterAttributes,
        where: commonFilters,
        limit: columnsResponse.table.limit,
        offset: columnsResponse.table.offset,
    })
    .then(workflowDatas => { 

        const recordIdList = workflowDatas.map(a => a.recordId);

        return {recordIdList: recordIdList, records: workflowDatas, error: null};

    }).catch(err => {

        return {recordIdList: recordIdList, records: workflowDatas, error: err};

    });
}   

const getRecordDataDate = async(columnsResponse, name, from, to) => {

    let commonFilters = await commonFiltersFunction(columnsResponse.table);
    Object.assign(commonFilters, {name: name});

    return WorkflowDatas.findAll({
        attributes: workflowFilterAttributes,
        where: commonFilters
    })
    .then(workflowDatas => { 

        let recordIdList = [];

        for (let i = 0; workflowDatas.length > i; i++) {

            const valueDate = new Date(workflowDatas[i].value).setUTCHours(0,0,0,0) + (3600 * 1000 * 24);

            if (valueDate >= from && valueDate <= to) {
                recordIdList.push(workflowDatas[i].recordId);
            }

        }

        return {recordIdList: recordIdList, records: workflowDatas, error: null};

    }).catch(err => {

        return {recordIdList: recordIdList, records: workflowDatas, error: err};

    });

}

const getRecordDataArray = async(columnsResponse, name, choice) => {

    let commonFilters = await commonFiltersFunction(columnsResponse.table);
    Object.assign(commonFilters, {name: name});

    return WorkflowDatas.findAll({
        attributes: workflowFilterAttributes,
        where: commonFilters
    })
    .then(workflowDatas => { 

        let recordIdList = [];

        for (let i = 0; workflowDatas.length > i; i++) {
            if (workflowDatas[i].type.name === 'checkbox'&& workflowDatas[i].isSelected) {

                    recordIdList.push(workflowDatas[i].recordId);

            } else if (workflowDatas[i].type.name === 'dropdown' && workflowDatas[i].isSelected) {

                    recordIdList.push(workflowDatas[i].recordId);

            }

        }

        return {recordIdList: recordIdList, records: workflowDatas, error: null};

    }).catch(err => {

        return {recordIdList: recordIdList, records: workflowDatas, error: err};

    });
}