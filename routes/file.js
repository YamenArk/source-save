const express = require('express');

const fileController = require('../controllers/file');
const Auth = require('../middleware/auth');
const sequelize = require('../util/database')
const request = require('../middleware/req');
const response = require('../middleware/res');

var uuid = require('uuid');
const path = require('path');

const multer = require('multer');
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

///////////////////////////////////////////////////////// files
router.get('/read_file',async function(req, res,next){

    try
    {
        transaction = await sequelize.transaction();
        await Auth.isAuth(req,res,next);
        await request.req(transaction,req, res,next)
        await fileController.read(req, res,next);   
        await response.res(transaction,req, res,next)
        await transaction.commit();
    }
    catch(err)
    {   
        if (transaction) await transaction.rollback();
        next(err);
    }
    });
  

router.put('/check_in',async function(req, res,next){

    try
    {
        transaction = await sequelize.transaction();
        await Auth.isAuth(req,res,next);
        await request.req(transaction,req, res,next)
        await fileController.check_in(req, res,next);   
        await response.res(transaction,req, res,next)
        await transaction.commit();
    }
    catch(err)
    {   
        if (transaction) await transaction.rollback();
        next(err);
    }
    });



router.put('/check_out',upload.single('file'),async function(req, res,next){

    try
    {
        console.log("===========")
        transaction = await sequelize.transaction();
        await Auth.isAuth(req,res,next);
        await request.req(transaction,req, res,next)
        await fileController.check_out(req, res,next);   
        await response.res(transaction,req, res,next)
        await transaction.commit();
    }
    catch(err)
    {   
        if (transaction) await transaction.rollback();
        next(err);
    }
    });
  


router.get('/myfiles',async function(req, res,next){

    try
    {
        transaction = await sequelize.transaction();
        await Auth.isAuth(req,res,next);
        await request.req(transaction,req, res,next)
        await fileController.myfiles(req, res,next);   
        await response.res(transaction,req, res,next)
        await transaction.commit();
    }
    catch(err)
    {   
        if (transaction) await transaction.rollback();
        next(err);
    }
    });
  


router.get('/show_files_in_group/:groupId',async function(req, res,next){

    try
    {
        transaction = await sequelize.transaction();
        await Auth.isAuth(req,res,next);
        await request.req(transaction,req, res,next)
        await fileController.show_files_in_group(req, res,next);   
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