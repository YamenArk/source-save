const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');



exports.login = async(req,res,next) =>{
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({where :{username : username,password : password}})
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
    req.userId  =  user.id;
    var message = [];
    message.push(user);
    message.push(token);
    req.message = JSON.stringify(message);
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
        })
    
        // await User.create({
        //     email : '213213',
        //     username : 'yamen',
        //     password : password,
        //     admin : 0
        // }, { transaction: t })
    
        // await t.commit();
        res.status(200).json({
            message : "your account has been created"
        })     
    }
    catch(err)
    {
        // await t.rollback();
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    }
}
