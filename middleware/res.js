const jwt = require('jsonwebtoken');
const { userInfo } = require('os');
const Res = require('../models/res')
const User = require('../models/user')
exports.res = async (transaction,req, res, next) => {
  const user = await User.findByPk(req.userId);
    await Res.create({
        method : req.method,
        path : req.path,
        status : res.statusCode,
        username : user.username,
        message : req.message
    },{ transaction: transaction })
};