const express = require('express');
const { generateKeyPair } = require('crypto');
const userController = require('../controllers/user');
const Auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const sequelize = require('../util/database')
const request = require('../middleware/req');
const response = require('../middleware/res');



const router = express.Router();

// router.get('/get_user/:userID',isAuth,userController.get_user);
//////////////////////////////////////////////////////////add files


router.get('/get_users',
async function(req, res,next){

  try
  {
    transaction = await sequelize.transaction();
    await Auth.isAuth(req,res,next);
    await request.req(transaction,req, res,next)
    await userController.get_users(req, res,next);
    await response.res(transaction,req, res,next)
    await transaction.commit();
  }
  catch(err)
  {   
      if (transaction) await transaction.rollback();
      next(err);
  }
  });


// ,userController.get_users);




router.post('/fileHistory',
async function(req, res,next){

  try
  {
    transaction = await sequelize.transaction();
    await adminAuth.isAuth(req,res,next);
    await request.req(transaction,req, res,next)
    await userController.file_history(req, res,next);
    await response.res(transaction,req, res,next)
    await transaction.commit();
  }
  catch(err)
  {   
      if (transaction) await transaction.rollback();
      next(err);
  }
  });


// userController.file_history);
router.post('/userHistory',
async function(req, res,next){

  try
  {
    transaction = await sequelize.transaction();
    await adminAuth.isAuth(req,res,next);
    await request.req(transaction,req, res,next)
    await userController.user_history(req, res,next);
    await response.res(transaction,req, res,next)
    await transaction.commit();
  }
  catch(err)
  {   
      if (transaction) await transaction.rollback();
      next(err);
  }
  });

// ,userController.user_history);



module.exports = router;

