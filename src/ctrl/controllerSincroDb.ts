//exports.sincroDb = async (req: any, res: any, next: any) => {   
exports.sincroDb = async (req: any, res: any, next: any) => {  

    const dateFormat = require("dateformat");
    const now = new Date();
    
    // Data   
    let campiTabella: any;
    let campiTabellaCount: any;
    let valorecampiGisfo: any;
    let pk_index: any;
    let datamodGisfo: any;
    let idpk: number;
    let idDataModifica = new Array(); 
    let idutente: number = req.params.idutente;
    let drawing: number = req.params.drawing;
    let codicecasuale: string = req.params.codicecasuale;
        
    
    const mymodule = require('../conf/connInfo');
    const sincroDbMysql = require('../assets/sincroDbMysql');  
    
    const pool_collaudolive = mymodule.conn_info_collaudolive_ssl_cry;    
    const pool_gisfo = mymodule.conn_info_gisfo_ssl_cry;
    
    
    // Funzioni Connessioni
    async function ConnessioneCollaudoLive() {    
        console.log('Inizio tentativo connessione con db CollaudoLive');
        const client = await pool_collaudolive.connect();
        console.log('Connessione a db CollaudoLive avvenuta !');
        client.release();
    }
    
    async function ConnessioneGisfo() {
        console.log('Inizio tentativo connessione con db Gisfo');
        const client = await pool_gisfo.connect();
        console.log('Connessione a db Gisfo avvenuta !');
        client.release();
    }
    
    
    
    //----------------------------------------------------------
    // Funzioni PRINCIPALI
    //----------------------------------------------------------
    
    async function QueryXCampiCollaudoLive(tableName: any) {    

        console.log('Verifica tabella: '+tableName)
    
        const sql = "SELECT * FROM information_schema.columns WHERE table_name = $1 order by ordinal_position asc";    
        const result = await pool_collaudolive.query(sql,[tableName])     
        let colRows = result.rows;
        campiTabellaCount=colRows.length;  
        let i: number;  
        for (i = 0; i < colRows.length; i++) {        
           
           //Creazione stringa con elenco campi tabella
           if(i==0){
             campiTabella=colRows[i]["column_name"];
           }
           else
           {
            campiTabella=campiTabella+","+colRows[i]["column_name"];
           }
           
           if(colRows[i]["column_name"]=='pk_'+tableName+''){
            idpk=i;
           }
    
           //Per campi con la data
           //let verCampoData = ["datamodifica", "data_inizio", "data_approvazione", "data_revisione", "data_emissione", "data_redazione", "data_caricamento", "data_emissione_contratto","dataultimasincronizzazione"];
           let verCampoData = ["datamodifica", "data_inizio", "data_approvazione", "data_revisione", "data_emissione", "data_redazione", "data_caricamento", "data_emissione_contratto","dataultimasincronizzazione","data_realizzazione","data_messa_esercizio","data_modifica"];
           
           let z;
           
           for (z = 0; z < verCampoData.length; z++) {        
                if( (colRows[i]["column_name"]==verCampoData[z]) ){
                    idDataModifica[i]=i;                
                }        
            }         
        }   
         
    }
    
    async function QuerySelectGisfo(numCol: any, NomiCampiCollaudoLive: any, drawing: any, idDataModifica: any, tableName: any, drawingProjects: any) { 
            
        console.log('Verifica drawing(pk_project): '+drawing) 
        console.log('--------------------------------------------') 
        
        //Verifica se presente qualche record con datamodifica aggiornata in Gisfo    
        //if(await confrontaDatamodifica(tableName,drawing)==1){
        
        //Eleborazione dati db Gisfo
        console.log('Elaborazione valori db GISFO')
        console.log('--------------------------------------------')
    
        const sql1 = {text: 'select * from newfont_dati.'+tableName+' where '+drawingProjects+' order by pk_'+tableName+' desc', rowMode: 'array'};  
        const result = await pool_gisfo.query(sql1);
        let records = result.rows;    
        //console.log(records);
        let numrecords: number=records.length;
        //numrecords=20;
        for (let idrow = 0; idrow < numrecords; idrow++) {        
            for (let idcol = 0; idcol < numCol; idcol++) {
               
                var elemento=records[idrow][idcol];
    
                //console.log(elemento);
                
                //ELABORAZIONE ELEMENTO
                //Verifica elemento vuoto
                if(typeof(elemento)!='boolean' && elemento==''){
                    elemento=0;
                }
                            
                if(idcol==idpk){
                    pk_index=elemento;  
                }
    
                if(idcol==0){                
                    valorecampiGisfo=elemento;                                        
                }
                else
                {
                   
                    // Elemento NON null e NON numero
                    if(elemento!==null && isNaN(elemento)){               
                    //if(elemento!==null && (typeof elemento != 'number')){
                        
                        elemento = elemento.replace(/'/g, "''");  
                                      
                        // Elemento DataModifica eseguire formattazione    
                        //if(idcol==idDataModifica){  
                        if(idDataModifica.indexOf(idcol)!=-1){                  
                            let formatted_date = formattaData(elemento);
                            elemento=formatted_date;
                            datamodGisfo=elemento;
                        }
                        // Elemento NON numeric inserirlo tra gli apici "'"                    
                        elemento="'"+elemento+"'";  
                        //console.log("A");                 
                    }
                    else
                    {
                       
                        // Elemento DataModifica eseguire formattazione    
                        //if(idcol==idDataModifica){  
                        if( (idDataModifica.indexOf(idcol)!=-1) && elemento!=null){                                                
                            //Formattazione datamodifica
                            elemento=formattaData(elemento);
                            datamodGisfo=elemento;
                            // Elemento NON numero inserirlo tra gli apici "'"
                            elemento="'"+elemento+"'";
                        }
                        else
                        {                    
                          // Elemento numero e quindi senza apici "'" 
                          //verifica tipo dato
                          if(typeof elemento != 'number'){
                            if(elemento!==null){
                                elemento="'"+elemento+"'";
                            }
                            else
                            {
                                elemento=elemento;
                            }
                          }
                          else
                          {
                            elemento=elemento;
                          }
                        }
                       
                        //console.log("B");
    
                        //console.log(typeof(elemento));
                        
                    }
                    //Formattare la virgola ","
                    //valorecampiGisfo = valorecampiGisfo.replace(",", ""); 
                    valorecampiGisfo=valorecampiGisfo+","+elemento;               
                                
                }
                
            }
            console.log('______________________________________________________');
            
            //Controllo presenza elemento in db CollaudoLive
            console.log('Controllo presenza elemento di '+tableName+' in db CollaudoLive')
            console.log('----------------------------------------------')
            if(await checkDbCollaudoLive(tableName,pk_index,datamodGisfo,drawing)===0){
                //Insert
                let queryInsert: string="INSERT INTO newfont_dati."+tableName+" ("+NomiCampiCollaudoLive+")VALUES("+ valorecampiGisfo +")";
               
                console.log(queryInsert);
                await pool_collaudolive.query(queryInsert);
                console.log('Insert in tabletName: "'+tableName+'" the record id: "'+pk_index+'"');
            }
            else
            {
                let avviso: string="Elemento di "+tableName+" già presente !";            
            }
            
        }    
        
    }
    
    async function delRecCollaudoLive(tableName: any,drawing: any ,drawingProjects: any ){    
        
        console.log('Verifica records da eliminare ')
        console.log('----------------------------------------------')
        
        //db CollaudoLive ---------------------------------
        const sql_coll = {text: 'select pk_'+tableName+' from newfont_dati.'+tableName+' where '+drawingProjects+' order by pk_'+tableName+' desc', rowMode: 'array'};  
        const res = await pool_collaudolive.query(sql_coll);
        let res1 = res.rows;
    
        //db Gisfo ------------------------------------------
        const sql_gisfo = {text: 'select pk_'+tableName+' from newfont_dati.'+tableName+' where '+drawingProjects+' order by pk_'+tableName+' desc', rowMode: 'array'};  
        const req = await pool_gisfo.query(sql_gisfo); 
        let req1 = req.rows;    
         
        //Ciclo per controllare se esistono elementi di COLLAUDOLIVE non più presenti din GISFO => bisogna ELIMINARLI DA COLLAUDOLIVE
        for (let i = 0; i < res.rowCount; i++){
            
            //Creare un array con tutti i valori della tabella in esame di GISFO
            var verifica=Array();
            for (let y = 0; y < req.rowCount; y++) {            
                var newLength = verifica.push(req1[y][0]);                       
            } 
            
            //Se nell'array di elementi della tabella in esame di GISFO non è più presente un valore di COLLAUDOLIVE => ELIMINARE QUEL VALORE DA COLLAUDOLIVE
            if(verifica.indexOf(res1[i][0])==-1){
                const sql_del = 'delete from newfont_dati.'+tableName+' where ('+drawingProjects+' and pk_'+tableName+' = '+res1[i][0]+')';  
                await pool_collaudolive.query(sql_del);    
                console.log('record: '+res1[i][0]+' non più presente in Gisfo bisogna quindi eliminarlo in COLLAUDOLIVE.')
                console.log('_____________________________________')  
            }        
                 
        }
       
    }
    
    
    //------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------
    
    // Verifica presenza record Gisfo in db CollaudoLive
    async function checkDbCollaudoLive(tableName: any, pk_index: any, datamodGisfo: any, drawing :any){

        console.log('Verifica se elemento di Gisfo è presente in CollaudoLive')
        console.log('---------------------------------------------------------------------')
        let checkDbCollaudoLive=0;                
            
        const sql_check_collaudolive = {text: 'select * from newfont_dati.'+tableName+' where pk_'+tableName+' = '+pk_index+'', rowMode: 'array'};  
        const result_check_collaudolive = await pool_collaudolive.query(sql_check_collaudolive);
        let res_check = result_check_collaudolive.rows;
            
        if(res_check.length>0){
            //Elemento di Gisfo già presente in db Collaudolive
            console.log('Elemento di Gisfo già presente in db Collaudolive')
            console.log('---------------------------------------------------------------------')
            let verAgg=await verificaAggiornamento(tableName,pk_index,datamodGisfo);
            if(verAgg==0){
                //Elemento già presente in db CollaudoLive ma deve essere aggiornato
                console.log('Elemento già presente in db CollaudoLive ma deve essere aggiornato')
                console.log('---------------------------------------------------------------------')
                checkDbCollaudoLive=0;          
            }
            else
            {
                //Elemento già presente in db CollaudoLive
                console.log('Elemento '+tableName+' già presente in db CollaudoLive')
                console.log('---------------------------------------------------------------------')
                checkDbCollaudoLive=1;           
            }    
        }
        else
        {
            //Elemento NON presente in db CollaudoLive
            console.log('Elemento di '+tableName+' (pk_'+tableName+' = '+pk_index+') NON presente in db CollaudoLive, deve essere inserito')
            console.log('---------------------------------------------------------------------')
            checkDbCollaudoLive=0
        }
       
        return checkDbCollaudoLive;
    
    }
    //Verifica aggiornamento per ogni singolo record
    async function verificaAggiornamento(tableName: any, pk_index: any, datamodGisfo: any){
        
        console.log('Verifica aggiornamento per ogni singolo record')
        console.log('---------------------------------------------------------------------')
    
        const sql_verifica_collaudolive = {text: 'select datamodifica from newfont_dati.'+tableName+' where pk_'+tableName+' = '+pk_index+'', rowMode: 'array'};  
        const result_verifica_collaudolive = await pool_collaudolive.query(sql_verifica_collaudolive);
        let res_verifica = result_verifica_collaudolive.rows;  
        
        //Formattazione data
        let datamodCollaudoLive: any;
        datamodCollaudoLive = formattaData(res_verifica[0][0]);
        let datamodCollaudoLive1: any = new Date(datamodCollaudoLive);
        let datamodCollaudoLive2: any = datamodCollaudoLive1.getTime();
        
        let datamodGisfo1: any = new Date(datamodGisfo);
        let datamodGisfo2: any = datamodGisfo1.getTime();
        
        let DeltaDataModifica = datamodGisfo2 - datamodCollaudoLive2;   
    
        let verAgg;
        if(DeltaDataModifica>0){
            
            //In gisfo l'elemento ha datamodifica più recente rispetto a quella in CollaudoLive
            //quindi eliminare l'elemento in CollaudoLive
            console.log('In gisfo elemento ha datamodifica più recente rispetto a quella in CollaudoLive')
            console.log('quindi eliminare elemento in CollaudoLive')
            console.log('---------------------------------------------------------------------')
    
            const sql_delete_collaudolive = {text: 'delete from newfont_dati.'+tableName+' where pk_'+tableName+' = '+pk_index+'', rowMode: 'array'};  
            await pool_collaudolive.query(sql_delete_collaudolive); 
            verAgg=0;  
            console.log('Elemento pk_'+tableName+': '+pk_index+' aggiornato.');
    
        }
        else
        {
            verAgg=1;
        }       
       return verAgg; 
    }
    
    async function checkvuota(tableName: any ,drawing: any){
    
        const sql = {text: 'select * from newfont_dati.'+tableName+' where drawing = '+drawing, rowMode: 'array'};  
        const res = await pool_collaudolive.query(sql);
        let num_res = res.length
    
        console.log(num_res)
        let checkvuota;
        if(num_res==0){
            checkvuota = 0;
        }
        else
        {
            checkvuota = 1;
        }
    
        return checkvuota;
    }
    
    
    async function confrontaDatamodifica(tableName: any, drawing: any, drawingProjects: any){
        let confrontaDatamodifica1=0;
        let nCollaudoLive;
        //Prendere DataModifica più recente nella tabella in CollaudoLive    
        const sql_confrontaDatamodifica_collaudolive = {text: 'select datamodifica from newfont_dati.'+tableName+' where ('+drawingProjects+' AND datamodifica is not null) order by datamodifica desc', rowMode: 'array'};  
        const result_confrontaDatamodifica_collaudolive = await pool_collaudolive.query(sql_confrontaDatamodifica_collaudolive);
        let res_confrontaDatamodifica_collaudolive = result_confrontaDatamodifica_collaudolive.rows;
    
        nCollaudoLive=res_confrontaDatamodifica_collaudolive.length;
        
    
        if(nCollaudoLive>0){
             
            //Formattazione data
            let dataconfCollaudoLive='';
            let dataconfCollaudoLive1;
            let dataconfCollaudoLive2;
            dataconfCollaudoLive = formattaData(res_confrontaDatamodifica_collaudolive[0][0]);
            dataconfCollaudoLive1 = new Date(dataconfCollaudoLive);
            dataconfCollaudoLive2 = dataconfCollaudoLive1.getTime();
         
            //console.log("Data CollaudoLive: " + dataconfCollaudoLive);
            //console.log("Data CollaudoLive1: " + dataconfCollaudoLive1);
            //console.log("Data CollaudoLive2: " + dataconfCollaudoLive2);
    
            //Prendere DataModifica più recente della tabella in Gisfo
            let dataconfGisfo0;
            let dataconfGisfo='';
            let dataconfGisfo1;
            let dataconfGisfo2;
            
            const sql_confrontaDatamodifica_gisfo = {text: 'select datamodifica from newfont_dati.'+tableName+' where ('+drawingProjects+' AND datamodifica is not null) order by datamodifica desc', rowMode: 'array'};  
            const result_confrontaDatamodifica_gisfo = await pool_gisfo.query(sql_confrontaDatamodifica_gisfo);
            if(result_confrontaDatamodifica_gisfo.rowCount==0){
                dataconfGisfo0 = new Date();
            }
            else
            {
                let res_confrontaDatamodifica_gisfo = result_confrontaDatamodifica_gisfo.rows;            
                dataconfGisfo0= formattaData(res_confrontaDatamodifica_gisfo[0][0]);            
            }
            
            //Formattazione data       
            
            dataconfGisfo = formattaData(dataconfGisfo0);        
            dataconfGisfo1 = new Date(dataconfGisfo);
            dataconfGisfo2 = dataconfGisfo1.getTime();
         
            //console.log("Data Gisfo: " +dataconfGisfo);
            //console.log("Data Gisfo1: " +dataconfGisfo1);
            //console.log("Data Gisfo2: " + dataconfGisfo2);
    
            //Verifica se datamodifica in Gisfo aggiornata
            if((dataconfGisfo2-dataconfCollaudoLive2==0)){
                //NON presente alcuna datamodifica aggiornata in Gisfo        
                confrontaDatamodifica1=0;
            }
            else
            {
                //PRESENTE datamodifica aggiornata in Gisfo (quindi da aggiornare/inserire)
                confrontaDatamodifica1=1;       
            }
    
        }
        else
        {
            confrontaDatamodifica1=1;
        }
        
        return confrontaDatamodifica1;
    }
    
    function formattaData(elemento: any){
    
        let current_datetime = new Date(elemento)
        let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()    
        
        return formatted_date
    }
    
    
    async function verDimTabel(tableName: any, drawing: any, drawingProjects: any){   
        
        //db CollaudoLive ---------------------------------
        const sql_coll = {text: 'select pk_'+tableName+' from newfont_dati.'+tableName+' where '+drawingProjects+' order by pk_'+tableName+' desc', rowMode: 'array'};  
        const res = await pool_collaudolive.query(sql_coll);
        let res1 = res.rows;   
        let res2=res1.length;    
    
        //db Gisfo ------------------------------------------
        const sql_gisfo = {text: 'select pk_'+tableName+' from newfont_dati.'+tableName+' where '+drawingProjects+' order by pk_'+tableName+' desc', rowMode: 'array'};  
        const req = await pool_gisfo.query(sql_gisfo); 
        let req1 = req.rows;    
        let req2=req1.length;
        let v;
        
        if(res2-req2==0){
            v = 0;
        }
        else
        {
            v = 1;
        }    
        return v;
    }
    
    async function insertMysql(idutente: number, pk_proj: number, codicecasuale: string){ 

        //Dati per MYSQL da POSTGRESQL 

         // NOME LOCALITA' -------------------------------- 
         let nome: string = '';
         const sql_name = {text: 'SELECT projects.pk_projects, projects.fk_comune, id_comune_decode.pk_comune, id_comune_decode.nome FROM newfont_dati.projects INNER JOIN newfont_dati.id_comune_decode ON projects.fk_comune = id_comune_decode.pk_comune WHERE projects.pk_projects = $1', rowMode: 'array'};
         const namecolla = await pool_collaudolive.query(sql_name,[pk_proj]);
         let namecolla1 = namecolla.rows;
 
         // verifica presenza nome località su db 
         if(namecolla1.length < 1){
             const sql_name2 = {text: 'SELECT projects.pk_projects, projects.name FROM newfont_dati.projects WHERE projects.pk_projects = $1', rowMode: 'array'};
             const namecolla2 = await pool_collaudolive.query(sql_name2,[pk_proj]);
             let namecolla3 = namecolla2.rows;
             nome = namecolla3[0][1];
         }
         else{
             nome = namecolla1[0][3];
         }

         console.log(nome);  
 
         // COORDINATE  --------------------------------
         let coord_terminazione: string;	
         let lat_centro_map: string ='';
         let long_centro_map: string = '';

         const sql_coord = {text: 'select ST_AsEWKT(geometry) from newfont_dati.prj_nodes WHERE geometry IS NOT NULL AND prj_nodes.drawing = $1 Order by datamodifica desc limit 1', rowMode: 'array'};
         const coordcolla = await pool_collaudolive.query(sql_coord,[pk_proj]);
         let coordcolla1 = coordcolla.rows;

         let nCollaudoLive=coordcolla1.length;    
         console.log(nCollaudoLive)

         if(nCollaudoLive>0){
            let geometria=coordcolla1[0][0];
            console.log(geometria);

            let geometria_netta = geometria.replace('POINT(', '');
            geometria_netta = geometria_netta.replace(')', '');

            console.log(geometria_netta);

            let coordinate = geometria_netta.split(" ");

            lat_centro_map = coordinate[1];
            long_centro_map = coordinate[0];

            console.log(lat_centro_map);
            console.log(long_centro_map);
         }
         else
         {           
            lat_centro_map='43.092922';
            long_centro_map='12.361422';
         }       	

         console.log(lat_centro_map);
         console.log(long_centro_map);   

        //INSERIMENTO DATI IN MYSQL PER UTILIZZO PROGETTO IN MAPPA
        const db = require('../conf/db');    

        //Controllo presenza pk_proj in tabella "rappre_prog_gisfo"        
        //let sqlSelect: any = 'SELECT pk_proj FROM rappre_prog_gisfo WHERE pk_proj = '+pk_proj+'';               
        let sqlSelect: any = "SELECT pk_proj FROM rappre_prog_gisfo WHERE pk_proj = ?"; 
        let datiMysql :any = [pk_proj]; 

        db.query(sqlSelect, datiMysql, function (err: any, result: any, fields: any) {               
            
            if(result.length < 1){ 
                
                let nodi_fisici: string = 'CollaudoLiveGisfo:prj_nodes';
                let nodi_ottici: string = 'CollaudoLiveGisfo:view_pcab_nodes';
                let tratte: string = 'CollaudoLiveGisfo:prj_lines_trenches';
                let conn_edif_opta: string = 'CollaudoLiveGisfo:view_connessione_edificio_pta'; 
                let codcasuale = codicecasuale;                    
        
                //Creazione Progetto su Collaudolive              
                let queryInsert:any = [idutente,pk_proj, nome, nodi_fisici, nodi_ottici, tratte, conn_edif_opta, long_centro_map, lat_centro_map, codicecasuale];
                let sqlInsert: any = "INSERT INTO rappre_prog_gisfo (idutente, pk_proj, nome, nodi_fisici, nodi_ottici, tratte, conn_edif_opta, long_centro_map, lat_centro_map,codcasuale) VALUES (?,?,?,?,?,?,?,?,?,?)";          
                db.query(sqlInsert, queryInsert);
                
                // Creazione room su Collaudolive
                sincroDbMysql.sincroDbMysqlMultistreaming(pk_proj, nome, idutente);
            }
            else
            {
                //Aggiornare data e codcasuale
                let datalastsincro1: any=dateFormat(now, "isoDateTime");
                let datalastsincro2: any = (datalastsincro1.replace('T', ' ')); 
                let datalastsincro3: any = datalastsincro2.split('+');
                let datalastsincro: any = datalastsincro3[0];
                
                console.log(datalastsincro);     
                let sqlUpdate: any = 'UPDATE rappre_prog_gisfo SET codcasuale = ?, DataLastSincro = ? WHERE pk_proj = '+pk_proj+''; 
                let queryUpdate:any = [codicecasuale, datalastsincro];         
                db.query(sqlUpdate, queryUpdate);
                
                console.log('pk_proj già presente nella tabella "rappre_prog_gisfo => aggiornamento codicecasuale"')
            }
        });

    }
        
    //----------------------------------------------------------------
    // Funzione Principale (main)
    async function main(idutente: number, drawing: any, codicecasuale: string) {
        
        res.json(true);

        console.log(idutente);
        console.log(drawing);
        console.log(codicecasuale);

        let tableName = ["area_pfs", "fib_joints", "fib_ports", "pcab_nodes","prj_lines_trenches", "prj_nodes", "splitter_primario", "splitter_secondario","projects"];
        //let tableName = ["area_pfs", "fib_joints"];      
        
        let y;
        let drawingProjects;
        for (y = 0; y < tableName.length; y++) {
           
            console.log(tableName[y].toUpperCase()) 
            
            console.log('-------------------------------------------')      
            
            //Verifica se c'è qualche aggiunta,modifica o eliminazione di record
            // - Se i campi Datamodifica più recenti delle tabelle sono uguali
            // - e
            // - Se il numero di record delle tabelle sono uguali
            // - Non sono stati aggiunti ne eliminati record in db Gisfo
            // - Quindi le tabelle sono uguali e non c'è bisogno di sincronizzarle.
            
            // Creazione variabile drawingProjects
            if(tableName[y]=='projects'){
                drawingProjects='pk_projects='+drawing;
            }
            else
            {
                drawingProjects='drawing='+drawing;
            } 
            
            console.log(drawingProjects); 
    
            if((await verDimTabel(tableName[y],drawing,drawingProjects)==0) && (await confrontaDatamodifica(tableName[y],drawing,drawingProjects)==0)){
                console.log('TABELLA '+tableName[y]+' NON DEVE ESSERE AGGIORNATA.'); 
                console.log('=====================================================')           
            }
            else
            {          
                await ConnessioneCollaudoLive();
                await QueryXCampiCollaudoLive(tableName[y]);
                await ConnessioneGisfo();
                await QuerySelectGisfo(campiTabellaCount,campiTabella,drawing,idDataModifica,tableName[y],drawingProjects);        
                await delRecCollaudoLive(tableName[y],drawing,drawingProjects);                      
            }    
      

            idDataModifica = [];
    
        }    
   
        
        //--Postgresql
        await ConnessioneCollaudoLive();
        //console.log(await comune(drawing))

        //--Mysql
        await insertMysql(idutente,drawing,codicecasuale);

    }

    //Per test
    //idutente=42;
    //drawing=129743824;

    //-----------------
    try {        
        await main(idutente,drawing,codicecasuale)       
        console.error('OPERAZIONE COMPLETATA.');         
    } catch (err: any) {
        res.json(false); 
        //res.status(status).send('Error: %s', err);
        //res.send('Error: %s', err); 
        console.error('Error: %s', err);
        console.error('Error: %s', err.stack);
    }
    
    
};


exports.sincroDbCheck = async (req: any, res: any, next: any) => { 

    //Controllo presenza codicecasuale in tabella "rappre_prog_gisfo" 

    const db = require('../conf/db');
    let codicecasuale: string = req.params.codicecasuale; 
                   
    let sqlSelect: any = "SELECT pk_proj FROM rappre_prog_gisfo WHERE codcasuale = ?"; 
    let datiMysql :any = [codicecasuale]; 

    await db.query(sqlSelect, datiMysql, function (err: any, result: any, fields: any) { 
        if(result.length < 1){
            console.log(codicecasuale + ' NON PRESENTE');          
            res.json(false);
        }
        else
        { 
            console.log(codicecasuale + ' GIA` PRESENTE');          
            res.json(true);
        }
        
    });

};