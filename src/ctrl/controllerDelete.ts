exports.delete = (req: any, res: any, next: any) => {   
    
    const db = require('../conf/db');
    
    let sql: any = '';
    let id: Number;
    let tableDelete: any; 
        
    //Controllo parametri e creazione query   
    if(typeof(req.body.id) !== 'undefined' && req.body.id !== null && typeof(req.body.id)==='number' && req.body.id !== ''){
        id = req.body.id; 

        //determina tabella da lavorare e genera query
        if(typeof(req.body.tableDelete) !== 'undefined' && req.body.tableDelete !== null && req.body.tableDelete !== ''){
            tableDelete = req.body.tableDelete;            
            sql = "DELETE FROM " + tableDelete + " WHERE id = ?";
        }
        
        esecuzioneQuery(sql);

    }
    else
    { res.send('Errore parametro id: vuoto, non numero , "undefined" o "null"');}
    //-----------------------    
    
    
    //-------------------
    // Esecuzione query
    //-------------------   
    function esecuzioneQuery(sqlDelete: any){        
        
        db.query(sqlDelete, [id], (err: any, rows: any, fields: any) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{           
                res.send(rows);
            }
        });
    }
   
};
