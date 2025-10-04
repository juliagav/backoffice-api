const express = require('express');
const router = express.Router();
//const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/user.controller');

router.get('/', userController.getUsers);

router.get('/:id', userController.getUser);

router.post('/', userController.createUser);

//router.post('/logout', userController.logout);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

//router.post('/login', userController.login);


module.exports = router;


