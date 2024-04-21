module.exports = function(socket: any) {
   
    require('../../io').io().on('connection', function(socket: any) {
    
        
        socket.on('chat message', (msg: any) => {            
            socket.broadcast.emit('chat message_' + msg.room, {                
                nominativo: msg.nominativo,       
                messaggio: msg.messaggio
            }); 
            socket.emit('chat message_' + msg.room, {                
                nominativo: msg.nominativo,       
                messaggio: msg.messaggio
            });     

        });    
    
    });

};