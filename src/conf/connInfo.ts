const Pool = require("pg").Pool;
const fsPg = require('fs');
const path = require('path');
const { Verify } = require("crypto");
const CreCry = require('./CreCry');


//4 Connessione a db G CON ssl e Crypt
const pool_gisfo_ssl_cry = new Pool({    
    host: CreCry.hostDecrypGis,
    database: CreCry.dbnDecrypGis,
    user: CreCry.userDecrypGis,
    password: CreCry.pwDecrypGis,
    port: CreCry.portDecrypGis
});
exports.conn_info_gisfo_ssl_cry = pool_gisfo_ssl_cry;

//5 Connessione a db Collaudolive CON ssl e Crypt
const pool_collaudolive_ssl_cry = new Pool({    
    host: CreCry.hostDecrypColl,
    database: CreCry.dbnDecrypColl,
    user: CreCry.userDecrypColl,   
    password: CreCry.pwDecrypColl,
    port: CreCry.portDecrypColl,
    // ssl: {
    //     rejectUnauthorized: false,
    //     ca: fsPg.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem').toString()  
    // }
});
exports.conn_info_collaudolive_ssl_cry = pool_collaudolive_ssl_cry;

