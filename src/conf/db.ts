//const config = require('./config');
const crecry = require('./CreCry');
const mysql = require('mysql');
const fs = require('fs');

const conn = mysql.createConnection({
    host     : crecry.dbhost,
    user     : crecry.dbusername,
    password : crecry.dbpassword,
    database : crecry.db,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem').toString()  
    }
});

module.exports = conn;