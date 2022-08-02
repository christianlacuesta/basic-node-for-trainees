const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/user/user');

router.get('/users', usersController.getUsers);

router.get('/users/:userId', usersController.getUser);

router.post('/users', [], usersController.createUser);

router.put('/users/:userId', [], usersController.updateUser);

router.delete('/users/:userId', usersController.deleteUser);

module.exports = router;

