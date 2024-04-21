module.exports = function(socket: any) {
   
    require('../../io').io().on('connection', function(socket: any) {
        
        socket.on('kmzemit',function(kmz_data: any){
            console.log('kmz_data: ' +kmz_data.kmz);
            socket.broadcast.emit('kmzon',{kmz: kmz_data.kmz})
        });
        
    })    
    
};