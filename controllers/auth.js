const User = require('../models/user');
const jwt = require('jsonwebtoken');
const NonFunction = require('./non-functional')
const sequelize = require('../util/database');



exports.login = (req,res,next) =>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({where :{username : username,password : password}})
    .then(user =>{
        if(!user)
        {
            const error = new Error('plz check the username or the password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
              userId : user.id,
              isAdmin : user.admin
            },
            'somesupersecretsecret',
            { expiresIn: '1y' }
          );
        res.status(200).send({
            user : user,
            token : token
        })

        var message = [];
        message.push(user);
        message.push(token);
        var jsonmessage = JSON.stringify(message);
        NonFunction.save_req_res('/login','post',user.id,200,jsonmessage,next)  
    })
    .catch(err =>{
        if(!err.statusCode)
        {
        err.status = 500;
        }
        NonFunction.save_req_res('/login','post',req.userId,err.statusCode,err.message,next)  
        next(err);
    });
}


exports.signup = async(req,res,next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const t = await sequelize.transaction();
    try
    {
        await User.create({
            email : email,
            username : username,
            password : password,
            admin : 0
        }, { transaction: t })
    
        // await User.create({
        //     email : '213213',
        //     username : 'yamen',
        //     password : password,
        //     admin : 0
        // }, { transaction: t })
    
        await t.commit();
        res.status(200).json({
            message : "your account has been created"
        })     
    }
    catch(err)
    {
        await t.rollback();
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    }
}
