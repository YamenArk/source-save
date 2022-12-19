const User = require('../models/user');
const Filee = require('../models/filee')
const History = require('../models/history');   
const { use } = require('../routes/auth');

////////////////////////////////////////////////////user
exports.get_users = async (req,res,next)=>{
    let  users;

        users = await User.findAll() ;
        if(!users || users.length == 0)
        {
            const error = new Error('thier are no users');
            error.statusCode = 404;
            throw error;
        }
        req.message = JSON.stringify(users);
        res.status(200).send(users);
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
        let user;
        const fileId = req.body.fileId;
        let sending_message = [];
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
                sending_message[i] ="file opened in "+file[i].createdAt+" from "+user.username
            }
            else
            {
                sending_message[i] ="file closed in "+file[i].createdAt+" from "+user.username
            }
            i++;
        }

        req.message = JSON.stringify(sending_message);

        res.status(200).send(sending_message);
}




exports.user_history = async(req,res,next) => {
        let file;
        const userId = req.body.userId;
        let sending_message = [];
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
                sending_message ="user opened file "+file.name+" in "+user[i].createdAt+"\n"
            }
            else
            {
                sending_message ="user closed file "+file.name+" in "+user[i].createdAt+"\n"
            }
            i++;
        }
        req.message = JSON.stringify(sending_message);
        res.status(200).send(sending_message);
}