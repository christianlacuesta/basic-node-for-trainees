const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/users/users');

router.get('/users', usersController.getUsers);

router.get('/users/choices/:fieldName', usersController.getUserFilterChoices);

router.get('/users/:userId', usersController.getUser);

router.get('/users/usersearchid/:userId', usersController.getUserSearchById);

router.post('/users/userdetails', [], usersController.getUserDetails);

router.post('/users/usersearch', [], usersController.getUserSearch);

router.post('/users/table', [], usersController.getUsersTable);

router.post('/users', [], usersController.createUser);

router.put('/users/:userId', [], usersController.updateUser);

router.delete('/users/:userId', usersController.deleteUser);

module.exports = router;

