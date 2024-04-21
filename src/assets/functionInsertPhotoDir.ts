exports.insertPhotoDir = (
  folderName: string,
  imageName: string,
  base64String: string,
  urlDatasave: any
) => {
  const fs = require('fs');
  require('dotenv').config();
  folderName=folderName.replace(' ','');
  console.log(folderName);
  

  try {
    // Selezione cartella a seconda di "produzione" o "sviluppo"    
    if (process.env.NODE_ENV == 'production') {
      urlDatasave = '/var/www/html/chat-operativa-master/frontend/datasave/';    
    }
    else
    {
      urlDatasave = '/var/www/html/chat-operativa-sviluppo/frontend/datasave/';      
    }
        
    // Verifica presenza cartella in caso neagativo la crea
    if (!fs.existsSync(urlDatasave + folderName)) {
      fs.mkdirSync(urlDatasave + folderName);
      console.log('Cartella creata !');
    } else {
      console.log('cartella già presente');
      console.log(urlDatasave + folderName);
      
    }

    // Remove header
    let base64Image = base64String.split(';base64,').pop();
    if (!fs.existsSync(urlDatasave + folderName + '/' + imageName)) {
      //Salvataggio foto in cartella specifica
      fs.writeFile(urlDatasave + folderName + '/' + imageName, 
        base64Image, { encoding: 'base64' },
        function (err: any) {
          console.log('File creato');
          console.log(urlDatasave + folderName + '/' + imageName);
          
        }
      );
    } else {
      console.log('foto già presente !');
    }
  } catch (err) {
    console.error(err);
  }
};
