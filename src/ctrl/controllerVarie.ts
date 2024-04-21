
exports.getCheckGalleria = (req: any, res: any, next: any) => {  
  
  const db = require('../conf/db');
  const validator = require('validator'); 
  
  let sql;
  let idroom;
  if (typeof(req.params.idroom) !== 'undefined' && validator.isNumeric(req.params.idroom) && (req.params.idroom)!= 0 && (req.params.idroom)!='') {
    idroom = req.params.idroom;            
  }
  else
  {
    idroom = '';
  } 

  sql = 'SELECT Count(*) AS numeroFoto, CAST(Count(*)/6 AS DECIMAL) AS numeroPagine, (6) AS numeroFotoXPagina FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = '+ idroom
  
  
   //-------------------
    // Esecuzione query
    //-------------------
    db.query(sql, (err: any, rows: any, fields: any) => {
      if(err){
        res.send('Query error: ' + err.sqlMessage);
       }else{                                             
         res.json(rows);
       }
    });

}


exports.downloadSinglePhoto = (req: any, res: any, next: any) => {  

  const db = require('../conf/db');
  const validator = require('validator'); 
  
  let sql;
  let idroom;
  if (typeof(req.params.idroom) !== 'undefined' && validator.isNumeric(req.params.idroom) && (req.params.idroom)!= 0 && (req.params.idroom)!='') {
    idroom = req.params.idroom;            
  }
  else
  {
    idroom = '';
  } 

  sql = 'SELECT Count(*) AS numeroFoto, CAST(Count(*)/6 AS DECIMAL) AS numeroPagine, (6) AS numeroFotoXPagina FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = '+ idroom
  
  
   //-------------------
    // Esecuzione query
    //-------------------
    db.query(sql, (err: any, rows: any, fields: any) => {
      if(err){
        res.send('Query error: ' + err.sqlMessage);
       }else{                                             
         res.json(rows);
       }
    });

}

exports.mappaProgetto = (req: any, res: any, next: any) => {  

  const db = require('../conf/db');
  const validator = require('validator'); 

  if (typeof(req.params.idroom) !== 'undefined' && validator.isNumeric(req.params.idroom) && (req.params.idroom)!= 0 && (req.params.idroom)!='') {
    let idroom = req.params.idroom;      
    //let sql: string = "SELECT * FROM rappre_prog_gisfo WHERE id = ?";
    let sql: string = "SELECT multistreaming.id, multistreaming.progettoselezionato, rappre_prog_gisfo.nome, rappre_prog_gisfo.nodi_fisici AS nodifisici, rappre_prog_gisfo.nodi_ottici AS nodiottici, rappre_prog_gisfo.tratte AS tratte, rappre_prog_gisfo.conn_edif_opta AS edifopta, rappre_prog_gisfo.lat_centro_map AS latcentromap, rappre_prog_gisfo.long_centro_map AS longcentrmap, multistreaming.progettoselezionato AS nome "
    sql = sql + "FROM rappre_prog_gisfo "
    sql = sql + "INNER JOIN multistreaming ON multistreaming.progettoselezionato = rappre_prog_gisfo.nome "
    sql = sql + "WHERE multistreaming.id = ? "
    let datiDb: any = [idroom];
    esecuzioneQuery(sql,datiDb);  
  }
  else
  {
    //Parametro usermobile errato
    res.json("Parametro non corretto. (non numero o 'undefined' o uguale a zero o vuoto");
  } 

    
  //-------------------
  // Esecuzione query
  //-------------------
  function esecuzioneQuery(sql: any, datiDb: any){    
    db.query(sql, [datiDb], (err: any, rows: any, fields: any) => {
      if(err || rows.length == 0){
        //Parametro idroom non presente 
        res.json("Parametro errato: idroom non presente");
      }else{                       
        res.json(rows);
      }
    });
  }

}