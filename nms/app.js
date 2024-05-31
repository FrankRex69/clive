const NodeMediaServer = require('node-media-server');
const fs = require("fs");

require('dotenv').config();

// Selezione cartella a seconda di "produzione" o "sviluppo"    
// if (process.env.NODE_ENV == 'production') {
//   port_nms_rtmp=1949;
//   port_nms_http=8019;
//   port_nms_https=8479;
// }
// else
// {
//   port_nms_rtmp=1941;
//   port_nms_http=8015;
//   port_nms_https=8471;
// }

port_nms_rtmp=1941;
port_nms_http=8015;
port_nms_https=8471;
 
const config = {
  rtmp: {
    port: port_nms_rtmp,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: port_nms_http,
    allow_origin: '*'
   },
  https: {
    port: port_nms_https,
    key: 'cert/privkey.pem',
    cert: 'cert/cert.pem'
  }
};
 
var nms = new NodeMediaServer(config)
nms.run();
