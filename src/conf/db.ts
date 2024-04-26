//const config = require('./config');
const crecry = require('./CreCry');
const mysql = require('mysql');
const fs = require('fs');

const conn = mysql.createConnection({
    host     : 'localhost', // localhost  -- crecry.dbhost
    user     : 'user', // user -- crecry.dbusername
    password : 'password', // password -- crecry.dbpassword,
    database : 'db', // db -- crecry.db
    // ssl: {
    //     rejectUnauthorized: false,
    //     ca: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem').toString()  
    // }
});

module.exports = conn;