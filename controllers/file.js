const User = require('../models/user');
const Filee = require('../models/filee');
const Sequelize = require('sequelize');
const Group = require('../models/group');
const fs = require('fs');
const History = require('../models/history');
const GroupUser = require('../models/group-user');
const path = require('path');
const NonFunction = require('./non-functional')




const Op = Sequelize.Op;





exports.myfiles = async (req,res,next) =>{
    try
    {
        let sending_array = [];
        let myfiles;
        //admin can see all files in database
        if(req.isAdmin)
        {
             myfiles = await Filee.findAll()

        }
        else
        {
             myfiles = await Filee.findAll({
                where : {
                    createdUserId : req.userId
                }
            })
        }
        if(myfiles.length == 0)
        {
            const error = new Error('you have not adding any files yet.');
            error.statusCode = 404;
            throw error;
        }
        let i= 0,checkInUserId,checkInUser;
        while(myfiles[i])
        {
            //the file is closed
            if(myfiles[i].status == false)
            {
                 sending_array.push({
                    fileId : myfiles[i].id,
                    fileName : myfiles[i].name,
                    fileUrl : myfiles[i].fileUrl,
                    state : 'close',
                })
            }
            //the file is in user
            else
            {
                checkInUserId = myfiles[i].checkInUserId;
                checkInUser = await User.findByPk(checkInUserId);
                 sending_array.push({
                    fileId : myfiles[i].id,
                    fileName : myfiles[i].name,
                    fileUrl : myfiles[i].fileUrl,
                    state : 'open',
                    checkInUserName : checkInUser.username
                })
            }
            i++;
        }
        res.status(200).send(sending_array);
        var jsonmessage = JSON.stringify(sending_array);
        NonFunction.save_req_res('/file/myfiles','get',req.userId,200,jsonmessage,next)  

    }
    catch(err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        NonFunction.save_req_res('/file/myfiles','get',req.userId,err.statusCode,err.message,next)  

        next(err);
    }
}



exports.show_files_in_group = async (req,res,next) => {
    try
    {
        const groupId = req.params.groupId;  
        const group = await Group.findByPk(groupId);
        if(!group)
        {
            const error = new Error('no group in this id.');
            error.statusCode = 401;
            throw error;
        }
        //authorization
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
                const error = new Error('you are not member in this group to see files.');
                error.statusCode = 401;
                throw error;
            }
        }


        let sending_array = [];
        const myfiles = await Filee.findAll({
            where : {
                groupId : groupId
            }
        })
        if(myfiles.length == 0)
        {
            const error = new Error('no files in this group.');
            error.statusCode = 404;
            throw error;
        }
        let i= 0,checkInUserId,checkInUser;
        while(myfiles[i])
        {
            //the file is closed
            if(myfiles[i].status == false)
            {
                sending_array.push({
                    fileId : myfiles[i].id,
                    fileName : myfiles[i].name,
                    fileUrl : myfiles[i].fileUrl,
                    state : 'close',
                })
            }
            //the file is in use
            else
            {
                checkInUserId = myfiles[i].checkInUserId;
                checkInUser = await User.findByPk(checkInUserId);
                sending_array.push({
                    fileName : myfiles[i].name,
                    fileUrl : myfiles[i].fileUrl,
                    state : 'open',
                    checkInUserName : checkInUser.username
                })
            }
            i++;
        }
        res.status(200).send(sending_array);
        var jsonmessage = JSON.stringify(sending_array);
        NonFunction.save_req_res('/file/show_files_in_group/:groupId','get',req.userId,200,jsonmessage,next)  
    }
    catch(err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        NonFunction.save_req_res('/file/show_files_in_group/:groupId','get',req.userId,err.statusCode,err.message,next)  

        next(err);
    }
}






exports.read = async (req,res,next) => {
    try
    {

        const fileId = req.body.fileId;
        const groupId = req.body.groupId;
        const group =  await Group.findByPk(groupId);
    
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
                const error = new Error('you are not member in this group to read this file.');
                error.statusCode = 401;
                throw error;
            }
        }
    
        const file = await Filee.findByPk(fileId)
        if(!file)
        {
            const error = new Error('you have been sending an empty id.');
            error.statusCode = 401;
            throw error;
        }
    
        if(file.status === true) 
        {
            const error = new Error('this file is in use.');
            error.statusCode = 404;
            throw error;
        }
    
        if(file.groupId != groupId)
        {
            const error = new Error('this file is in not in this group.');
            error.statusCode = 401;
            throw error;
        }
    
        res.status(200).json({
            name : file.name,
            file : file.fileUrl
        })
        const message = 'name:'+file.name+"\nfile"+file.fileUrl;
        NonFunction.save_req_res('/file/read_file','get',req.userId,200,message,next)  
    }
    catch(err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        NonFunction.save_req_res('/file/read_file','get',req.userId,err.statusCode,err.message,next)  

        next(err);
    }
}



exports.check_in = async(req,res,next) =>{
    try
    {
        let sending_array  = [];
        const files_array = req.body.files_array;
        const groupId = req.body.groupId;
        let file_row;
        let i =0;
        const group =  await Group.findByPk(groupId);

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
                const error = new Error('you are not member in this group to read this file.');
                error.statusCode = 401;
                throw error;
            }
        }

        //ckeck if all files in this group
        while(files_array[i])
        {
            file_row = await Filee.findByPk(files_array[i])
            if(!file_row)
            {
                const error = new Error('you have been sending an empty id.');
                error.statusCode = 401;
                throw error;
            }

            if(file_row.status === true) 
            {
                const error = new Error('this file is in use.');
                error.statusCode = 404;
                throw error;
            }

            if(file_row.groupId != groupId)
            {
                const error = new Error('this file is in not in this group.');
                error.statusCode = 401;
                throw error;
            }
            i++;
        }
        i= 0;
        //ckeck in on files
        while(files_array[i])
        {

            file_row = await Filee.findByPk(files_array[i])
            file_row.status = true;
            file_row.checkInUserId = req.userId
            file_row.save();

            sending_array.push({
                name : file_row.name,
                fileUrl : file_row.fileUrl
            });

            //to save into historiy
            await History.create({
                status: true,
                userId : req.userId,
                fileeId  : file_row.id 
            })
            
            i++;
        }
        res.status(200).send(sending_array);
        var jsonmessage = JSON.stringify(sending_array);
        NonFunction.save_req_res('/file/check_in','put',req.userId,200,jsonmessage,next)  
    }
    catch(err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        NonFunction.save_req_res('/file/check_in','put',req.userId,err.statusCode,err.message,next)  

        next(err);
    }
}


exports.check_out = async(req,res,next) =>{
    try
    {
        const fileId = req.body.fileId;
        let file = await Filee.findByPk(fileId);
        if(!file)
        {
            const error = new Error('Could not find this file.');
            error.statusCode = 404;
            throw error;
        }

        //check if the file is opened
        if(file.state === false)
        {
            const error = new Error('this file is closed.');
            error.statusCode = 404;
            throw error;
        }

        //check if he checked in first
        if(file.checkInUserId != req.userId)
        {
            const error = new Error('you cant check out unitl you check in.');
            error.statusCode = 404;
            throw error;
        }

        //delete the old file
        clearFile(file.fileUrl);

        destination= req.file.destination.split('./public');
        const fileUrl = destination[1]+'/'+req.file.filename;


        file.fileUrl = fileUrl;
        file.checkInUserId = null;
        file.status = false;
        await file.save();

        await History.create({
            status: false,
            userId : req.userId,
            fileeId  : fileId 
        })
        
        res.status(200).json({
            message : 'file has been closed'
        })
        NonFunction.save_req_res('/file/check_out','put',req.userId,200,'file has been closed',next)  
    }
    catch(err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        NonFunction.save_req_res('/file/check_out','put',req.userId,err.statusCode,err.message,next)  
        next(err);
    }
}


const clearFile = filePath => {
    filePath = path.join(__dirname, '../public', filePath);

    fs.unlink(filePath, err => console.log());
    // fs.rmdir(filePath, { recursive: true }, err => console.log(err));
  };



