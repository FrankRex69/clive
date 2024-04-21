
module.exports = function(socket: any) { 
    
    require('../../io').io().on('connection', function(socket: any) {

        socket.on('posizioneMarker', (posMkr: any) => {
        
            socket.broadcast.emit('posMkrBckEnd_' + posMkr.idroom, {                
                idroom: posMkr.idroom, 
                latitudine: posMkr.latitudine, 
                longitudine: posMkr.longitudine
            });            

        }); 

        socket.on('deleteMarkerIndicazioni', (delMkr: any) => {           
            console.log(delMkr.roomId);
            
            socket.broadcast.emit('deleteMarkerIndicazioni' + delMkr.roomId, {                
                roomId: delMkr.roomId               
            });            

        });        

    })
    
};