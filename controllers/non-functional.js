const ReqRes = require('../models/req-res');
const User = require('../models/user');


exports.save_req_res = (api,type,userId,status,message,next) =>
{
    User.findByPk(userId)
    .then(user =>{
        if(!user)
        {
            const error = new Error('you have no id');
            error.statusCode = 401;
            throw error;
        }
        ReqRes.create({
            type : type,
            api : api,
            status : status,
            message : message,
            username : user.username  
        })
    })
    .catch(err =>{
        if(!err.statusCode)
        {
        err.status = 500;
        }
        next(err);
    });
}
