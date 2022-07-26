const express = require('express');
const router = express.Router();
const adminTableController = require('../../../controllers/table/admin-table/admin-table');

router.post('/workflowtable/admintable', [], adminTableController.getAdminTable);

module.exports = router;