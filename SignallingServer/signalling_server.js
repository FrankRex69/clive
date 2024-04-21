const HttpsServer = require('https').createServer;
const fs = require("fs");
const WebSocket = require('ws');

server = HttpsServer({    
    key: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
})
socket = new WebSocket.Server({
    server: server
})


socket.broadcast = (ws, data) => {   
    socket.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            //client.send(data);
            client.send(JSON.stringify(data))
            console.log('send data: ' + data)
        }
    });
};

socket.on('connection', ws => {
    
    console.log(`Client connected. Total connected clients: ${socket.clients.size}`);

    ws.on('message', message => {   
        console.log('message' + message + "\n\n");  
        const dataNew = JSON.parse(message);     
        socket.broadcast(ws, dataNew);        
                 
    });
    ws.on('close', ws=> {
        console.log(`Client disconnected. Total connected clients: ${socket.clients.size}`);
    })

    ws.on('error', error => {
        console.log(`Client error. Total connected clients: ${socket.clients.size}`);
    });
    
});

server.listen(5556);
