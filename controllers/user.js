const User = require('../models/user');
const Filee = require('../models/filee')
const History = require('../models/history');   
const { use } = require('../routes/auth');
const NonFunction = require('./non-functional')

////////////////////////////////////////////////////user
exports.get_users = async (req,res,next)=>{
    let  users;
    try
    {

        users = await User.findAll() ;
        if(!users || users.length == 0)
        {
            const error = new Error('thier are no users');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).send(users);
        var jsonmessage = JSON.stringify(users);
        NonFunction.save_req_res('/user/get_users','get',req.userId,200,jsonmessage,next)  

    }
    catch(err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          NonFunction.save_req_res('/user/get_users','get',req.userId,err.statusCode,err.message,next)  
        next(err);
    }
}

// exports.get_user = (req,res,next) =>{
//     const userID = req.params.userID;
//     User.findByPk(userID)
//     .then(user =>{
//         if(!user)
//         {
//             const error = new Error('Could not find this user.');
//             error.statusCode = 404;
//             throw error;
//         }
//         res.status(200).send(user);
//     })
//     .catch(err =>{
//         if(!err.statusCode)
//         {
//         err.status = 500;
//         }
//         next(err);
//     });
// }



exports.file_history = async(req,res,next) => { 
    try
    {
        let user;
        const fileId = req.body.fileId;
        let sending_message = '';
        const file = await History.findAll({where : { fileeId : fileId}})
        if(file.length === 0 )
        {
            const error = new Error('this file has not been used yet.');
            error.statusCode = 404;
            throw error;
        }
        let i = 0;
        while(file[i])
        {
            user = await User.findByPk(file[i].userId);
            if(file[i].status == true)
            {
                sending_message =sending_message+"file opened in "+file[i].createdAt+" from "+user.username+"\n"
            }
            else
            {
                sending_message =sending_message+"file closed in "+file[i].createdAt+" from "+user.username+"\n"
            }
            i++;
        }
        res.status(200).send(sending_message);
        var jsonmessage = JSON.stringify(sending_message);
        NonFunction.save_req_res('/user/fileHistory','get',req.userId,200,jsonmessage,next)  
    }
    catch(err)
    {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        NonFunction.save_req_res('/user/fileHistory','get',req.userId,err.statusCode,err.message,next)  
        next(err);
    }
}




exports.user_history = async(req,res,next) => {
    try
    {
        let file;
        const userId = req.body.userId;
        let sending_message = '';
        const user = await History.findAll({where : { userId : userId}})
        if(user.length === 0 )
        {
            const error = new Error('this user has not opened anyfile yet.');
            error.statusCode = 404;
            throw error;
        }
        let i = 0;
        while(user[i])
        {
            file = await Filee.findByPk(user[i].fileeId);
            if(user[i].status == true)
            {
                sending_message =sending_message+"user opened file "+file.name+" in "+user[i].createdAt+"\n"
            }
            else
            {
                sending_message =sending_message+"user closed file "+file.name+" in "+user[i].createdAt+"\n"
            }
            i++;
        }
        res.status(200).send(sending_message);
        var jsonmessage = JSON.stringify(sending_message);
        NonFunction.save_req_res('/user/userHistory','get',req.userId,200,jsonmessage,next)  
    }
    catch(err)
    {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        NonFunction.save_req_res('/user/userHistory','get',req.userId,err.statusCode,err.message,next)  
        next(err);
    }
}