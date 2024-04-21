module.exports = function(socket: any) { 
    
    require('../../io').io().on('connection', function(socket: any) {

        socket.on('startDraw', (stD: any) => {            
            
            socket.broadcast.emit('startDrawOn_' + stD._idroom, { 
                _remoteCanvasWidth: stD._remoteCanvasWidth,
                _remoteCanvasHeight: stD._remoteCanvasHeight,                
                _lineWidth: stD._lineWidth,
                _color: stD._color,
                _saveX: stD._saveX,
                _saveY: stD._saveY                
            });  

        }); 
        
        socket.on('movedDraw', (mvD: any) => {             
            
            socket.broadcast.emit('movedDrawOn_' + mvD._idroom, {                
                _currentX: mvD._currentX,
                _currentY: mvD._currentY                
            });  

        }); 

        socket.on('isBoard', (isbD: any) => {             
            
            console.log(isbD.room);
            console.log(isbD.board);

            socket.broadcast.emit('isBoard' + isbD.room, {                
                board: isbD.board
                              
            });  

        });
        
        socket.on('clearBoard', (cbD: any) => {             
            
            console.log(cbD.room);            

            socket.broadcast.emit('clearBoard' + cbD.room);  

        });
        
        socket.on('isBoardClose', (ibC: any) => {                      

            socket.broadcast.emit('isBoardClose' + ibC.room);  

        });
        
    })
    
};