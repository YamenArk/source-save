const express = require('express');

const groupController = require('../controllers/group');
const isAuth = require('../middleware/auth');

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



router.post('/add_file/:groupId',upload.single('file'),isAuth,groupController.add_file);
router.delete('/delete_file/:fileId',upload.single('file'),isAuth,groupController.delete_file);


  



///////////////////////////////////////////////////////// group
router.post('/add_group',isAuth,groupController.add_group);
router.get('/get_groups',isAuth,groupController.get_groups);
router.put('/:groupId/user/:userId',isAuth,groupController.add_user_to_group);
router.delete('/:groupId/user/:userId',isAuth,groupController.delete_user_from_group);






module.exports = router;