exports.VidApp = (req: any, res: any, next: any) => { 

    const { exec } = require("child_process");
    require('dotenv').config();

    let istruzioneRestart: string;
    let url_nms: any;
    if (process.env.NODE_ENV == 'production') {       
        istruzioneRestart = "pm2 restart " + process.env.PM2NAME_NODE_MEDIA_SERVER_PROD; 
        url_nms = process.env.VIDAPP_PRODUZIONE;
    }
    else
    {
        istruzioneRestart = "pm2 restart " + process.env.PM2NAME_NODE_MEDIA_SERVER_DEV; 
        url_nms = process.env.VIDAPP_SVILUPPO;
    }

    console.log(istruzioneRestart);
    
 
    try {

        exec(url_nms, (error: any, stdout: any, stderr: any) => {
            
            console.log('Node Media Server Riavviato');
            res.send('Node Media Server Riavviato');

            if (error) {
                console.log(`error: ${error.message}`);          
                return;
            }
            if (stdout) {
              console.log(`stdout: ${stdout}`);
              return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }     
           
        });

        res.json({
            "restartNMS": true
        });
      
    } catch (error) {
        res.json({
            "restartNMS": false
        });
     }  
  

};