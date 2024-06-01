//const config = require('./config');
const crecry = require('./CreCry');
const mysql = require('mysql');
const fs = require('fs');

let db_host = 'db'
if (process.env.NODE_ENV !== 'production') {
    db_host='localhost'
}

console.log('db_host --->  ' + db_host);


// const conn = mysql.createConnection({    
//     host     : db_host, // (in Docker host is the name for database in the docker-compose)
//     user     : 'user', // user -- crecry.dbusername
//     password : 'password', // password -- crecry.dbpassword,
//     database : 'db', // db -- crecry.db
//     // ssl: {
//     //     rejectUnauthorized: false,
//     //     ca: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem').toString()  
//     // }
// });


const conn  = mysql.createPool({
  connectionLimit : 10,
  host     : db_host, // (in Docker host is the name for database in the docker-compose)
  user     : 'user', // user -- crecry.dbusername
  password : 'password', // password -- crecry.dbpassword,
  database : 'db', // db -- crecry.db
});

module.exports = conn;