



exports.getTable = (req, res, next) => {

    const table = {
        organizationId: req.body.organizationId, 
        systemId: req.body.systemId,
        interfaceId: req.body.interfaceId,
        limit: req.body.limit,
        offset: req.body.offset,
        filters: req.body.filters,
        name: null,
        totalRows: null,
        rows: [],
        columns: [],
    }


}

const getColumnsConfig = () => {

}

const getRows = () => {

}