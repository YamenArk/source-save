const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const config1 = require('./util/config1');
const config2 = require('./util/config2');
const mysql = require("mysql2");
const normalizePort = require('normalize-port');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

connection.query(
  `CREATE DATABASE IF NOT EXISTS SourceSafe`,
  function (err, results) {
  }
);

connection.end();


const sequelize = require('./util/database');
const GroupUser = require('./models/group-user');
const Group = require('./models/group');
const User = require('./models/user');




const app = express();




const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/group');
const fileRoutes = require('./routes/file');
const userRoutes = require('./routes/user');

let current = 0;


   
  app.use((req, res, next) => {
    if(current == 0)
    {    
      var port = normalizePort('8000');
      app.set('port', port);
      current++;
    }
    else
    {
      var port = normalizePort('8001');
      app.set('port', port);
      current --
    }
    next();
  }); 

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json()); // application/json
  
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });


  app.use('/group',groupRoutes);
  app.use('/user',userRoutes);
  app.use('/file',fileRoutes)
  app.use(authRoutes);
  
  
  app.use(express.urlencoded({extended: true}));
  
  
  app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });







User.belongsToMany(Group , {through : GroupUser});






sequelize
// .sync({ force: true })
.sync()
.then(result => {

server = app.listen(3000, () => {
    console.log(`API REST running in http://localhost:${3000}`);
});
app.listen(config1.port, () => {
  console.log(`API REST running in http://localhost:${config1.port}`);
});
app.listen(config2.port, () => {
  console.log(`API REST running in http://localhost:${config2.port}`);
});
})
.catch(err => {
console.log(err);
});













  


