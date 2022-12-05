const express = require('express');
const { generateKeyPair } = require('crypto');
const userController = require('../controllers/user');
const isAuth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');




const router = express.Router();

//////////////////////////////////////////////////////////add files


router.get('/get_users',isAuth,userController.get_users);
// router.get('/get_user/:userID',isAuth,userController.get_user);




router.get('/fileHistory',adminAuth,userController.file_history);
router.get('/userHistory',adminAuth,userController.user_history);



module.exports = router;