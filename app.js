const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cluster = require('cluster');
const { generateKeyPair } = require('crypto');


const numCPUs = require('os').cpus().length;

const mysql = require("mysql2");

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



// For Master process
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  console.log("=============")
  console.log(numCPUs)
  console.log("=============")

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // This event is firs when worker died
  cluster.on('exit', (worker, code, signal) => {
    console.log("=============")
    console.log(`worker ${worker.process.pid} died`);
  });
}
else
{


  sequelize
    // .sync({   force: true })
    .sync()
    .then(result => {
      app.listen(3000, err => {
        err ?
          console.log("Error in server setup") :
          console.log("=====================")
          console.log(`Worker ${process.pid} started`);
      });
    })
    .catch(err => {
      console.log(err);
    });

}


