const express = require('express');

const fileController = require('../controllers/file');
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

///////////////////////////////////////////////////////// files
router.get('/read_file',isAuth,fileController.read);
router.put('/check_in',isAuth,fileController.check_in);
router.put('/check_out',upload.single('file'),isAuth,fileController.check_out);


router.get('/myfiles',isAuth,fileController.myfiles);
router.get('/show_files_in_group/:groupId',isAuth,fileController.show_files_in_group);


module.exports = router;