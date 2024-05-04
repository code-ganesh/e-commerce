const express = require('express');
const router = express.Router();
const { register, login, signOut, deleteUser, updateUser, getUsers, getUser, isAdmin } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.delete('/delete', deleteUser);
router.get('/signout', signOut);
router.put('/update', updateUser);
router.get('/users', getUsers);
router.get('/user', getUser);

module.exports = router;
