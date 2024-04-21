exports.insertRateVideo = (parametroUnico: string) => {  

    const db = require('../conf/db');
    
    let queryInsert:any = []; 
    let messageErrore: any = '';
        
    if(typeof(parametroUnico) !== 'undefined' && parametroUnico !== null && parametroUnico !== ''){                
        queryInsert.push(parametroUnico);        
        let sql: any = "INSERT INTO ratevideodata (dati) VALUES (?)"; 
        esecuzioneQuery(sql);               
    }
    else
    { 
        let messageErrore = ('Errore parametro COMMESSA: vuoto, "undefined" o "null"'); 
        console.log(messageErrore);
    }    

    //-----------------------------   
    function esecuzioneQuery(sqlInsert: any){        
        
        db.query(sqlInsert, queryInsert, (err: any, rows: any, fields: any) => {
            if(err){
                console.log('Query error: ' + err.sqlMessage);
            }else{           
                //console.log(rows);
            }
        });
    }
    //-----------------------------

}