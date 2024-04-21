  exports.CheckDownloadZip = (req: any, res: any, next: any) => {  
    
    const fs = require('fs'); 
    const path = require('path');    
            
    //-- Determinazione cartella da verificare
    let nameRooms: any = req.params.folderzip; 
    const urlzip: string = __dirname.replace('build/ctrl','frontend/datasave/'+nameRooms);
    
    //-- Controllo se cartella: (non-esiste o vuota) => true; se esiste e non è vuota => false
    function isFull(urlzip: any) {
      try {
          return fs.readdirSync(urlzip).length !== 0;
      } catch (error) {
        return false;
      }
    }

    res.send(isFull(urlzip));
  
  }
  
  exports.DownloadZip = (req: any, res: any, next: any) => {
    
    const AdmZip = require('adm-zip');  
    const zip = new AdmZip();  
    const fs = require('fs');
    const path = require('path');
   
    //----------- determinazione nome cartella     
     let nameRooms = req.params.folderzip;   
     
     //-- Creazione cartella compressa
     const urlzip: string = __dirname.replace('build/ctrl','frontend/datasave/'+nameRooms);    
  
     fs.readdirSync(urlzip).forEach((file: string) => {           
       zip.addLocalFile(urlzip + '/' + file);          
     });
   
     // --- Esecuzione download
     const downloadName = `${nameRooms}.zip`;
     const data = zip.toBuffer();
     res.set('Content-Type','application/octet-stream');
     res.set('Content-Disposition',`attachment; filename=${downloadName}`);
     res.set('Content-Length',data.length);
     res.send(data);
    
  
  };

   