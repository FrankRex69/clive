exports.idCasUtenti = function(iLen: number){

  // Da modificare per nascondere user su room
  let sRnd = '';
  let sChrs = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"; 
  let checkpresenxa: any=false;
  let ii: number = 0;
  do {
    //Creazione codice casuale
    for (var i = 0; i < iLen; i++) {
      let randomPoz = Math.floor(Math.random() * sChrs.length);
      sRnd += sChrs.substring(randomPoz, randomPoz + 1);
    }

    //Verifica se codice casuale è già presente nel db Mysql
    const db = require('../conf/db'); 
    let SelectMysql: any = 'SELECT * FROM rappre_prog_gisfo WHERE codcasuale = ?';    
    let datiMulti :any = ['123'];
  
    db.query(SelectMysql, datiMulti, function (err: any, result: any, fields: any) {  
      if(result.length < 1){   
        checkpresenxa=false;
      }
      else
      {
        checkpresenxa=true;
      }
    });
    ii=ii+1;    
  } while (checkpresenxa===true);

}