const express = require('express');

const groupController = require('../controllers/group');
const Auth = require('../middleware/auth');
const sequelize = require('../util/database')
const request = require('../middleware/req');
const response = require('../middleware/res');

var uuid = require('uuid');
const path = require('path');

const multer = require('multer');
const e = require('express');
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let path;
        path = './public/files';
        callBack(null, path)     //  directory name where save the file
          
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + uuid.v1() + path.extname(file.originalname))
    }
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  var upload = multer({
    storage: storage,
    fileFilter: fileFilter
  }); 

const router = express.Router();



router.post('/add_file/:groupId',upload.single('file'),
async function(req, res,next){

  try
  {
    transaction = await sequelize.transaction();
    await Auth.isAuth(req,res,next);
    await request.req(transaction,req, res,next)
    await groupController.add_file(req, res,next);
    await response.res(transaction,req, res,next)
    await transaction.commit();
  }
  catch(err)
  {   
      if (transaction) await transaction.rollback();
      next(err);
  }
  });





router.delete('/delete_file/:fileId',upload.single('file'), async function(req, res,next){

  try
  {
    transaction = await sequelize.transaction();
    await Auth.isAuth(req,res,next);
    await request.req(transaction,req, res,next)
    await groupController.delete_file(req, res,next);
    await response.res(transaction,req, res,next)
    await transaction.commit();
  }
  catch(err)
  {   
      if (transaction) await transaction.rollback();
      next(err);
  }
  });

  



///////////////////////////////////////////////////////// group
router.post('/add_group', async function(req, res,next){

  try
  {
    transaction = await sequelize.transaction();
    await Auth.isAuth(req,res,next);
    await request.req(transaction,req, res,next)
    await groupController.add_group(transaction,req, res,next);
    await response.res(transaction,req, res,next)
    await transaction.commit();
  }
  catch(err)
  {   
      if (transaction) await transaction.rollback();
      next(err);
  }
  });


router.get('/get_groups', async function(req, res,next){

  try
  {
    transaction = await sequelize.transaction();
    await Auth.isAuth(req,res,next);
    await request.req(transaction,req, res,next)
    await groupController.get_groups(req, res,next);
    await response.res(transaction,req, res,next)
    await transaction.commit();
  }
  catch(err)
  {   
      if (transaction) await transaction.rollback();
      next(err);
  }
  });


// ,groupController.get_groups);
router.put('/:groupId/user/:userId', async function(req, res,next){

  try
  {
    transaction = await sequelize.transaction();
    await Auth.isAuth(req,res,next);
    await request.req(transaction,req, res,next)
    await groupController.add_user_to_group(req, res,next);
    await response.res(transaction,req, res,next)
    await transaction.commit();
  }
  catch(err)
  {   
      if (transaction) await transaction.rollback();
      next(err);
  }
  });








// ,groupController.add_user_to_group);
router.delete('/:groupId/user/:userId', async function(req, res,next){

  try
  {
    transaction = await sequelize.transaction();
    await Auth.isAuth(req,res,next);
    await request.req(transaction,req, res,next)
    await groupController.delete_user_from_group(req, res,next);
    await response.res(transaction,req, res,next)
    await transaction.commit();
  }
  catch(err)
  {   
      if (transaction) await transaction.rollback();
      next(err);
  }
  });

module.exports = router;