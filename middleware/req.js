const jwt = require('jsonwebtoken');
const Req = require('../models/req')
exports.req = async (transaction,req, res, next) => {
    await Req.create({
        method : req.method,
        path : req.path
    },{ transaction: transaction })
};