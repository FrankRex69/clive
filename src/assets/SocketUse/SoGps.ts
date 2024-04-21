module.exports = function(socket: any) {
   
    require('../../io').io().on('connection', function(socket: any) {
        
       //SOCKET PER POSIZIONAMENTO / GPS / COORDINATE
       socket.on('gps', (gps_data: any) => {        
        socket.broadcast.emit('gpsUtente_idroom_'+gps_data.idroom, {idroom: gps_data.idroom, latitudine: gps_data.latitudine, longitudine: gps_data.longitudine});  
       });
        
    })    
    
};