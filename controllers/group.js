const User = require('../models/user');
const Filee = require('../models/filee');
const Sequelize = require('sequelize');
const Group = require('../models/group');
const GroupUser = require('../models/group-user');
const NonFunction = require('./non-functional')
const path = require('path');
const fs = require('fs');


const Op = Sequelize.Op;




////////////////////////////////////////////////////user
exports.add_group = (req,res,next) =>
{
    const name = req.body.name;
    User.findByPk(req.userId)
    .then(user =>{
        if(!user)
        {
            const error = new Error('Could not find this user.');
            error.statusCode = 404;
            throw error;
        }
        return Group.create({
            name : name,
            admin : req.userId
        })
    })
    .then(group =>{
        res.status(201).send(group);
        var jsonmessage = JSON.stringify(group);
        NonFunction.save_req_res('/group/add_group','post',req.userId,201,jsonmessage,next)  

    })
    .catch(err =>{
        if(!err.statusCode)
        {
        err.status = 500;
        }
        NonFunction.save_req_res('/group/add_group','post',req.userId,err.statusCode,err.message,next)  
        next(err);
    });
}


exports.get_groups = async(req,res,next)=>{
    try
    {
        const user = await User.findByPk(req.userId);
        if(!user)
        {
            const error = new Error('Could not find this user.');
            error.statusCode = 404;
            throw error;
        }
        if(user.admin == true)
        {
            const groups = await Group.findAll();
            if(groups.length == 0)
            {
                const error = new Error('no groups created yet.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                groups : groups
            })
        }
        let admin = await Group.findAll({where : { admin : req.userId}})
        let groups = await user.getGroups();
        if(admin.length === 0 && groups.length === 0)
        {
            const error = new Error('you have no groups.');
            error.statusCode = 404;
            throw error;
        }

        //making an json message
        var message = [];
        message.push(admin);
        message.push(groups);
        var jsonmessage = JSON.stringify(message);


        res.status(200).json({
            admin : admin,
            groups : groups
        })

        //saving request and res
        NonFunction.save_req_res('/group/get_groups','get',req.userId,201,jsonmessage,next)  
    }
    catch(err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        NonFunction.save_req_res('/group/get_groups','get',req.userId,err.statusCode,err.message,next)  

        next(err);
    }
}








exports.add_user_to_group = async(req,res,next) =>{
    try
    {
        const groupId = req.params.groupId;
        const AddedUserId = req.params.userId;

        let group = await Group.findByPk(groupId)
        if(!group)
        {
            const error = new Error('no group in this id.');
            error.statusCode = 404;
            throw error;
        }

        //check if he is not the admin
        if(group.admin != req.userId && !req.isAdmin)
        {
            const error = new Error('you are not the admin in this group to add users.');
            error.statusCode = 404;
            throw error;
        }

        //check if he is adding him self
        if(group.admin == AddedUserId)
        {
            const error = new Error('you cant add your self.');
            error.statusCode = 404;
            throw error;   
        }

        const user =await User.findByPk(AddedUserId);
        if(!user)
        {
            const error = new Error('Could not find this user.');
            error.statusCode = 404;
            throw error;
        }
        if(user.isAdmin)
        {
            const error = new Error('you cant add the admin into any groups.');
            error.statusCode = 401;
            throw error;
        }
        const does_this_user_already_connected_to_this_projects = await GroupUser.findOne({
            where: {
                [Op.and]:[
                    {userId : AddedUserId },
                    {groupId : groupId},
                ]
        }})
        if(does_this_user_already_connected_to_this_projects)
        {
            const error = new Error('this user is already connected to this project.');
            error.statusCode = 400;
            throw error; 
        }
         await user.addGroup(group);

        res.status(200).send({
            message : 'it has been added successfully'
        })
        NonFunction.save_req_res('/group/add_group','put',req.userId,200,'it has been added successfully',next)  
    }
    catch(err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        NonFunction.save_req_res('/group/add_group','put',req.userId,err.statusCode,err.message,next)  
        next(err);
    }
}



////////////////////////////////
exports.delete_user_from_group = async (req,res,next) =>{
    try
    {
        const groupId = req.params.groupId;
        const deleteUserId = req.params.userId;

        let group = await Group.findByPk(groupId)
        if(!group)
        {
            const error = new Error('no group in this id.');
            error.statusCode = 404;
            throw error;
        }
        //check if the admin is deleting
        if(group.admin != req.userId && !req.isAdmin)
        {
            const error = new Error('you are not the admin in this group to add users.');
            error.statusCode = 404;
            throw error;
        }
        //check if he is deleting the admin
        if(deleteUserId == req.userId)
        {
            const error = new Error('you cant delete your self from the group.');
            error.statusCode = 404;
            throw error;
        }
        const user =await User.findByPk(deleteUserId);
        if(!user)
        {
            const error = new Error('Could not find this user.');
            error.statusCode = 404;
            throw error;
        }
        // check if the user is checking in any file
        const checkInFile = await Filee.findAll({where : {
            [Op.and]:[
                {  groupId : group.id },
                {   checkInUserId : deleteUserId},
            ]
        }});
        if(checkInFile.length != 0)
        {
            const error = new Error('you cant delete this user because he is checking in somefiles.');
            error.statusCode = 404;
            throw error;
        }

        //deleting the group
        await GroupUser.destroy({where : {
            groupId :group.id ,
            userId : deleteUserId
        }})
        res.status(200).send({
            message : 'it has been deleted successfully'
        })

        NonFunction.save_req_res('/group/:groupId/user/:userId','delete',req.userId,201,'it has been deleted successfully',next)  

    }
    catch(err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          NonFunction.save_req_res('/group/:groupId/user/:userId','delete',req.userId,err.statusCode,err.message,next)  

        next(err);
    }
}







exports.add_file =  async(req,res,next) =>{
    try
    {
        const groupId = req.params.groupId;
        if(!req.file )
        {
            const error = new Error(' Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }   
        const user = User.findByPk(req.userId);
        if(!user)
        {
            const error = new Error('thier is some error.');
            error.statusCode = 401;
            throw error;
        }
        const group = await Group.findByPk(groupId)
        if(!group)
        {
            const error = new Error('this gorup is not exist.');
            error.statusCode = 401;
            throw error;
        }
        //check if the user in this group
        if(group.admin == req.userId || req.isAdmin)
        {

        }
        else
        {
            const member =await GroupUser.findOne({where : {
                [Op.and]:[
                    {  groupId : groupId },
                    {   userId : req.userId},
                ]
            }})
            if(!member)
            {
                const error = new Error('you are not member in this group to add this file.');
                error.statusCode = 401;
                throw error;
            }
        }

        destination= req.file.destination.split('./public');
        const fileUrl = destination[1]+'/'+req.file.filename;
        await Filee.create({
            fileUrl : fileUrl,
            name : req.file.originalname,
            status : false,
            createdUserId : req.userId,
            groupId : groupId
        })

        res.status(201).json({
            message : 'file has been added'
        })
        NonFunction.save_req_res('/group/add_group','post',req.userId,201,'file has been added',next)  
    }
    catch(err)
    {
        delete fileUrl
        destination= req.file.destination.split('./public');
        const fileUrl = destination[1]+'/'+req.file.filename;
        if(fileUrl)
        {
            clearFile(fileUrl);
        }
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        NonFunction.save_req_res('/group/add_group','post',req.userId,err.statusCode,err.message,next)  
        next(err);
    }
}
  

exports.delete_file = async(req,res,next) => {
    try
    {
        const fileId = req.params.fileId;
        const user = User.findByPk(req.userId);
        if(!user)
        {
            const error = new Error('thier is some error.');
            error.statusCode = 401;
            throw error;
        }

         //to check if the file to this user 
        const file = await Filee.findByPk(fileId);
        if(!file)
        {
            const error = new Error('this is an empty id.');
            error.statusCode = 404;
            throw error;
        }
        if(file.createdUserId != req.userId && !req.isAdmin)
        {
            const error = new Error('this isnt your file to delete.');
            error.statusCode = 401;
            throw error;
        }
        //to check if the file is closed 
        if(file.status == true)
        {
            const error = new Error('someone has checked in this file.');
            error.statusCode = 401;
            throw error;
        }

        file.destroy();
        res.status(201).json({
            message : 'file has been deleted'
        })
        NonFunction.save_req_res('/group/delete_file/:fileId','delete',req.userId,201,'file has been deleted',next)  
    }
    catch(err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        NonFunction.save_req_res('/group/delete_file/:fileId','delete',req.userId,err.statusCode,err.message,next)  
        
        next(err);
    }
}





const clearFile = filePath => {
    console.log("======================")
    console.log(filePath)
    filePath = path.join(__dirname, '../public', filePath);
    console.log("=====================")

    fs.unlink(filePath, err => console.log());
    // fs.rmdir(filePath, { recursive: true }, err => console.log(err));
  };


