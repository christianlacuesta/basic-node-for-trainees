const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee');

router.post('/employee', [], employeeController.getEmployees);

router.post('/employee/create', [], employeeController.postEmployees);

router.put('/employee/:idNo', [], employeeController.putEmployees);

router.delete('/employee/:idNo', employeeController.deleteEmployees);


module.exports = router;