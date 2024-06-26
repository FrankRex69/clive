import express from 'express';
import path from 'path';
import fs from 'fs';
const routes = require('./routes');
const app = express();
import * as dotenv from 'dotenv';

let url_env_base = __dirname;
let url_env: string = url_env_base.replace("build",".env")
dotenv.config({ path:url_env});

let port: any;
// if (process.env.NODE_ENV == 'production' && process.env.NODE_ENV != undefined) {
//   port = process.env.PORT_PROD;
// }
// else
// {
//   port = process.env.PORT_DEV;
// }
port=9187;

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

//-----------------------------------------------------------------------------------------------------------
//SEZIONE ROUTE NODEJS
//-----------------------------------------------------------------------------------------------------------

// Indirizzamento verso route API --
app.use('/', routes);


//Indirizzamento verso route FRONTEND
app.use('/',express.static(path.join(__dirname, '../frontend/www')));
app.use('/*', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/www/index.html')); });

//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

let server: any;
if (process.env.NODE_ENV == 'production' && process.env.NODE_ENV != undefined) { 
  server = require('https').createServer( 
  	{
  		key: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
  	},
  app);
} 
else
{
  server = require('http').createServer({}, app);
} 


//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------

// -- Cors 
const options = {
  cors: {
    origin: [`http://localhost`,`http://localhost:8100`],
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true     
  },
  allowEIO3: true
};

//-----------------------------------------------------------------------------------------
//------------------------- Socket connection ---------------------------------------------
//-----------------------------------------------------------------------------------------

const io = require('./io').initialize(server, options);

//SOCKET PER TEST    
require('./assets/SocketUse/SoTest')(io);

//SOCKET PER CHAT TESTUALE    
require('./assets/SocketUse/SoChat')(io);

//SOCKET PER KMZ
require('./assets/SocketUse/SoKmz')(io);

//SOCKET PER POSIZIONAMENTO / GPS / COORDINATE
require('./assets/SocketUse/SoGps')(io);

//SOCKET PER MARKER
require('./assets/SocketUse/SoMarker')(io);

//SOCKET PER LAVAGNA CONDIVISA (SHARE BOARD)
require('./assets/SocketUse/SoBoard')(io);

//SOCKET PER STREAMING RTMP
require('./assets/SocketUse/SoStreamingRtmp')(io);

io.on('error',function(e: any){	
	console.log('socket.io error:'+e);
});

//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------


server.listen(port, function(){  
  console.log(`http://localhost:${port}`);
});

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log('Errore :' + err);
    // Note: after client disconnect, the subprocess will cause an Error EPIPE, which can only be caught this way.
})