const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('authorization');
  
  if (!authHeader) {
    const error = new Error('Not authenticated1.');
    error.statusCode = 401;
    throw error;
  }
  
  const token =authHeader.split('Bearer ')[1];
  let decodedToken ;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  req.isAdmin = decodedToken.isAdmin;
  next();
};