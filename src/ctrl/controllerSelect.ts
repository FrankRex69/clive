exports.getSelect = (req: any, res: any, next: any) => {  
    
    const db = require('../conf/db');
    const validator = require('validator');       
    
    // Definizione variabili
    let table = req.params.table;
    let sql;
    
    let idutcas;
    let idroom;
    let pagGall;
    let numberFotoPage;

    //-------------------------
    //Verifica parametri
    //-------------------------

    if (typeof(req.params.idutcas) !== 'undefined' && (req.params.idutcas)!= 0 && (req.params.idutcas)!='') {
        idutcas = req.params.idutcas;
    }
    else
    {
        idutcas = '';
    }

    if (typeof(req.params.idroom) !== 'undefined' && validator.isNumeric(req.params.idroom) && (req.params.idroom)!= 0 && (req.params.idroom)!='') {
      idroom = req.params.idroom;            
    }
    else
    {
      idroom = '';
    } 

   if (typeof(req.params.pagGall) !== 'undefined' && validator.isNumeric(req.params.pagGall) && (req.params.pagGall)!= 0 && (req.params.pagGall)!='') {
      pagGall = req.params.pagGall;            
    }
    else
    {
      pagGall = '';
    }

    if (typeof(req.params.numberFotoPage) !== 'undefined' && validator.isNumeric(req.params.numberFotoPage) && (req.params.numberFotoPage)!= 0 && (req.params.numberFotoPage)!='') {
      numberFotoPage = req.params.numberFotoPage;            
    }
    else
    {
      numberFotoPage = '';
    }
    
    //---------------------
    //Selezione tipo query  
    //---------------------  
    switch (table) {        
        
        case "room":
            
          //sql="SELECT multistreaming.cod AS cod, multistreaming.id AS id, multistreaming.usermobile AS usermobile, multistreaming.progettoselezionato AS progettoselezionato, utenti.collaudatoreufficio AS collaudatoreufficio, multistreaming.DataInsert AS DataInsert FROM multistreaming INNER JOIN utenti ON utenti.id = multistreaming.collaudatoreufficio ";
          
          sql = 'SELECT multistreaming.cod AS cod, multistreaming.id AS id, multistreaming.usermobile AS usermobile, multistreaming.progettoselezionato AS progettoselezionato, rappre_prog_gisfo.DataLastSincro AS dataLastsincro, utenti.collaudatoreufficio AS collaudatoreufficio, utenti.id AS idutente, multistreaming.DataInsert AS DataInsert, commesse.id AS idcommessa, commesse.denominazione AS commessa ';
          sql = sql + ' FROM multistreaming INNER JOIN utenti ON utenti.id = multistreaming.collaudatoreufficio ';
          sql = sql + ' INNER JOIN commesse ON commesse.id = utenti.idcommessa ';
          sql = sql + ' INNER JOIN rappre_prog_gisfo ON rappre_prog_gisfo.nome = multistreaming.progettoselezionato ';

          //"id" sarebbe "idroom"
          if(idroom==''){
            
              console.log(idutcas);
              
              if (idutcas == '') {
                
                  sql= sql + "ORDER BY id DESC";               
              }
              else
              //idutcas != '' ==> utente specifico
              {       
                
                  sql= sql + " WHERE IF((SELECT autorizzazioni FROM `utenti` WHERE `idutcas` = '" + idutcas + "') = 3,";
                  sql= sql + " idcommessa = (SELECT idcommessa FROM `utenti` WHERE `idutcas` = '" + idutcas + "'),";
                  sql= sql + " IF((SELECT autorizzazioni FROM `utenti` WHERE `idutcas` = '" + idutcas + "') = 1,";
                  sql= sql + " utenti.idutcas !='',";
                  sql= sql + " utenti.idutcas = (SELECT idutcas FROM `utenti` WHERE `idutcas` = '" + idutcas + "')))";
                  sql= sql + " ORDER BY id DESC";
              }                         
          }
          else
          {
              if (idutcas == '') {                  
                  sql= sql + "WHERE multistreaming.id = " + idroom + " ORDER BY id DESC";               
              }
              else
              {                  
                sql= sql + "WHERE multistreaming.id = " + idroom + " AND utenti.idutcas = '" + idutcas + "' ORDER BY id DESC"; 
              }                
          }        
          
          console.log('select x rooms: ' + sql);            
           
        break;  

        case "utenti":   
        
          if(idutcas==''){
            sql='SELECT utenti.id, utenti.idutcas, utenti.DataCreazione, utenti.collaudatoreufficio, utenti.username, utenti.password, utenti.autorizzazioni, utenti.idcommessa AS idcommessa, commesse.denominazione AS commessa ';       
            sql = sql + 'FROM utenti INNER JOIN commesse ON commesse.id = utenti.idcommessa   ORDER BY `id` DESC'; 
          }
          else
          {
            sql='SELECT utenti.id, utenti.idutcas, utenti.DataCreazione, utenti.collaudatoreufficio, utenti.username, utenti.password, utenti.autorizzazioni, utenti.idcommessa AS idcommessa, commesse.denominazione AS commessa ';       
            sql = sql + 'FROM utenti INNER JOIN commesse ON commesse.id = utenti.idcommessa ';
            sql = sql + 'WHERE utenti.idutcas = "'+ idutcas +'"'; 
            console.log(sql);
          }
          /* 
          if(idutcas==''){
            sql='SELECT utenti.id, utenti.idutcas, utenti.DataCreazione, utenti.collaudatoreufficio, utenti.username, utenti.password, autorizzazioni.denominazioneAuth AS autorizzazioni, utenti.idcommessa AS idcommessa, commesse.denominazione AS commessa ';       
            sql = sql + 'FROM utenti INNER JOIN commesse ON commesse.id = utenti.idcommessa ';
            sql = sql + 'INNER JOIN autorizzazioni ON autorizzazioni.id = utenti.autorizzazioni  ORDER BY `id` DESC'; 
          }
          else
          {
            sql='SELECT utenti.id, utenti.idutcas, utenti.DataCreazione, utenti.collaudatoreufficio, utenti.username, utenti.password, autorizzazioni.denominazioneAuth AS autorizzazioni, utenti.idcommessa AS idcommessa, commesse.denominazione AS commessa ';       
            sql = sql + 'FROM utenti INNER JOIN commesse ON commesse.id = utenti.idcommessa ';
            sql = sql + 'INNER JOIN autorizzazioni ON autorizzazioni.id = utenti.autorizzazioni ';
            sql = sql + 'WHERE utenti.idutcas = "'+ idutcas +'"'; 
            console.log(sql);
          } */

        break;

        case "progetti":
          sql = 'SELECT rappre_prog_gisfo.id AS idprogetto, rappre_prog_gisfo.DataSincro AS datasincro, rappre_prog_gisfo.DataLastSincro AS DataLastSincro, utenti.collaudatoreufficio, rappre_prog_gisfo.pk_proj AS pk_proj, rappre_prog_gisfo.nome AS nome, rappre_prog_gisfo.nodi_fisici AS nodi_fisici, rappre_prog_gisfo.nodi_ottici AS nodi_ottici, rappre_prog_gisfo.tratte AS tratte, rappre_prog_gisfo.conn_edif_opta AS conn_edif_opta, rappre_prog_gisfo.long_centro_map AS long_centro_map, rappre_prog_gisfo.lat_centro_map AS lat_centro_map, utenti.id AS idutente, commesse.id AS idcommessa, commesse.denominazione AS commessa';
          sql = sql + ' FROM `rappre_prog_gisfo` INNER JOIN utenti ON utenti.id = rappre_prog_gisfo.idutente INNER JOIN `commesse` ON utenti.idcommessa = commesse.id ORDER BY `idprogetto` DESC';
          console.log(sql);
          
        break; 
          
        case "commessa":

          sql = 'SELECT id AS idcommessa, denominazione AS commessa FROM commesse ORDER BY id ASC';   

        break;

        case "galleria":
          //const numberFotoPage = 6;
          let paginit;
          
          if(pagGall==''){

           //sql = 'SELECT collaudolive.id, collaudolive.progettoselezionato, collaudolive.collaudatoreufficio, collaudolive.dataimg, collaudolive.nameimg, collaudolive.latitu, collaudolive.longitu, collaudolive.nomelemento, collaudolive.noteimg, collaudolive.onlynota, TO_BASE64(collaudolive.img) AS foto, multistreaming.progettoselezionato, multistreaming.id FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = '+ idroom +' ORDER BY collaudolive.id DESC'
           sql = 'SELECT multistreaming.id AS idroom, collaudolive.id AS idPhoto, collaudolive.progettoselezionato, collaudolive.collaudatoreufficio, collaudolive.dataimg, collaudolive.nameimg, collaudolive.latitu, collaudolive.longitu, collaudolive.nomelemento, collaudolive.noteimg, collaudolive.onlynota, collaudolive.img AS foto, multistreaming.progettoselezionato, multistreaming.id FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = '+ idroom +' ORDER BY collaudolive.id DESC'
           //sql = 'SELECT collaudolive.img AS foto FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = '+ idroom +' ORDER BY collaudolive.id DESC'
            
          }
          else
          {
            if(numberFotoPage==''){
              numberFotoPage=6;
            }

            if (pagGall==1){
              paginit = 0;
            }
            else
            {
              paginit = (pagGall-1) * numberFotoPage;
            }
            
            //sql = 'SELECT collaudolive.id, collaudolive.progettoselezionato, collaudolive.collaudatoreufficio, collaudolive.dataimg, collaudolive.nameimg, collaudolive.latitu, collaudolive.longitu, collaudolive.nomelemento, collaudolive.noteimg, collaudolive.onlynota, TO_BASE64(collaudolive.img) AS foto, multistreaming.progettoselezionato, multistreaming.id FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = '+ idroom +' ORDER BY collaudolive.id DESC limit '+paginit+',' +numberFotoPage
            sql = 'SELECT multistreaming.id AS idroom, collaudolive.id AS idPhoto, collaudolive.progettoselezionato, collaudolive.collaudatoreufficio, collaudolive.dataimg, collaudolive.nameimg, collaudolive.latitu, collaudolive.longitu, collaudolive.nomelemento, collaudolive.noteimg, collaudolive.onlynota, collaudolive.img AS foto, multistreaming.progettoselezionato FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = '+ idroom +' ORDER BY collaudolive.id DESC limit '+paginit+',' +numberFotoPage
            //sql = 'SELECT collaudolive.img AS foto FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = '+ idroom +' ORDER BY collaudolive.id DESC limit '+paginit+',' +numberFotoPage
            
          }        

          break;  
          
          case "autorizzazioni":

          sql = 'SELECT denominazioneAuth AS denAut, id AS idAut FROM autorizzazioni ORDER BY id ASC';   

        break;

      }      
    //----------------------------------
    
    //-------------------
    // Esecuzione query
    //-------------------    
    db.query(sql, (err: any, rows: any, fields: any) => {
      /* let base64data = Buffer.from(rows[0]['img']).toString('base64'); */
      if(err){
        res.send('Query error: ' + err.sqlMessage);
       }else{  
         //res.setHeader('Content-Type', 'text/html'); 
         //const base64 = rows.toString('base64');                                          
         res.json(rows);
       }
    });      
   
};

