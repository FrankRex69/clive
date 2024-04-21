module.exports = function(socket: any) { 
    
    require('../../io').io().on('connection', function(socket: any) {

        socket.on('testDispositivi', (testDati: any) => {            

            console.log('testDati.userAgent: ' + testDati.userAgent);
            console.log('testDati.deviceLabel: ' + testDati.deviceLabel);    
            console.log('Verifica mobile: ' + testDati.mobile);         

        });
        
        socket.on('kind', (testDati2: any) => {          

            console.log('testDati2.kind: ' + testDati2.kind);
                      

        });
        
    })
    
};