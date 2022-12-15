const express = require('express');
const sequelize = require('../util/database')

const authController = require('../controllers/auth');
const request = require('../middleware/req');
const response = require('../middleware/res');



const router = express.Router();

const helperFunction = transaction =>{
} 

router.post('/login', async function(req, res,next){
    try
    {

        transaction = await sequelize.transaction();
        await request.req(transaction,req, res,next)
        await authController.login(req, res,next);
        await response.res(transaction,req, res,next)
        await transaction.commit();
    }
    catch(err)
    {   
        console.log("in the place")
        if (transaction) await transaction.rollback();
        next(err);
    }
});
router.post('/signup',authController.signup);

module.exports = router;