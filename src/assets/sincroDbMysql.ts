exports.sincroDbMysqlMultistreaming = async function(pk_proj: any, nome: string, idutente: number){
    
    //SALVATAGGIO DATI IN multistreaming MYSQL
    //Controllo presenza cod=pk_prj in tabella "multistreaming"
    const db = require('../conf/db'); 
    let SelectMulti: any = "SELECT cod FROM multistreaming WHERE cod = ?"; 
    let datiMulti :any = [pk_proj];
    await db.query(SelectMulti, datiMulti, function (err: any, result: any, fields: any) {        
        if(result.length < 1){                    
            let usermobile = nome.toLowerCase();
            usermobile = usermobile.replace(/ /g, '');
            let queryInsert:any = [pk_proj, usermobile, nome, idutente];
            let sqlInsert: any = "INSERT INTO multistreaming (cod, usermobile, progettoselezionato, collaudatoreufficio) VALUES (?,?,?,?)";          
            db.query(sqlInsert, queryInsert);           
        }
        else
        {
            console.log('Room già presente in Collaudolive')
        }
    });

}




  