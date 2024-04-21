
let utentiInConference: any[] = [];

//--------------------------------------- FUNZIONI PER ARRAY MULTIDIMENSIONALE ---------------------------------------------

//-------------------- SPLIT RTMP -----------------------------------

let idutentesplit = function (urlrtmp: string){
	let idutenteinside = urlrtmp.split('/');
	let idutenteidentificato = idutenteinside[idutenteinside.length-1]
	return idutenteidentificato; 
}

let idroomsplit = function (urlrtmp: string){
	let idroominside = urlrtmp.split('/');
	let idroomidentificata = idroominside[idroominside.length-2]
	return idroomidentificata; 
}

//-------------- Funzioni di ricerca -------------------------------
let checkPresenzaIdRoom = function (idroom: number){    
    let checkIdroom = -1;  
    // --- Verifica: 1) se esiste l'array, se la lunghezza dell'array è > 0 e se è presente idroom nell'array
    if(utentiInConference && utentiInConference.length > 0){        
        for (let index = 0; index < utentiInConference.length; index++) {            
            if(utentiInConference[index][0]==idroom){            
                checkIdroom = index;                                        
            }                                     
        }
    }
    else
    {
        checkIdroom = -1;
    }

    let checkPresenzaFinaleIdRoom = checkIdroom;
    return checkPresenzaFinaleIdRoom;
}


let checkPresenzaIdUtente = function (idroom: number, idutente : string){    
    let checkPresenzaFinaleIdUtente = false;
    let index = checkPresenzaIdRoom(idroom);
    
    if(utentiInConference && utentiInConference.length > 0){  
        for (let x = 0; x < utentiInConference[index].length; x++) {           	
            if(utentiInConference[index][x].idutente==idutente){                        
                checkPresenzaFinaleIdUtente = true;      
            }  
        }
    }        
   
    return checkPresenzaFinaleIdUtente;
}

let checkPresenzaSocketid = function (socketid: string){    
    let checkPresenzaFinaleSocketid: any= -1;	
    for (let y = 0; y < utentiInConference.length; y++) {        
        for (let x = 0; x < utentiInConference[y].length; x++) {           	
            if(utentiInConference[y][x].socketid==socketid){                        
               checkPresenzaFinaleSocketid = {x,y}; 
               //console.log('Socketid X e Y: ' + x + '-' + y);       
            }  
        }        
    }    
    return checkPresenzaFinaleSocketid;
}

let checkpidstream = function (arrayRoom: any){ 
    let pidstream = 0;        
    for (let x = 1; x < arrayRoom.length; x++) {           	
        if(arrayRoom[x].pidstream != 0){     
            pidstream = arrayRoom[x].pidstream;                
        }  
    }      
    return pidstream;
}

//----------------------------- INSERIMENTO ELEMENTO IN MATRICE MULTIDIMENSIONALE ------------------------------------------

let insertArray = function (idroom: number, idutente: string, socketid: string, nomeUtente: string){
   
	let elemento: any = '';

    // INSERIRE ROOM ED UTENTE
    if(checkPresenzaIdRoom(idroom)==-1){
        console.log("idroom NON PRESENTE e di conseguenza NON presente anche l'idutente => bisogna inserirli entrambi nell'array !");
        //idroom NON PRESENTE e di conseguenza NON presente anche l'idutente => bisogna inserirli entrambi nell'array !  
		 //elemento = {'idutente': idutente, 'socketid': socketid, 'stream': false};  
		elemento = {idutente: `${idutente}`, nome: `${nomeUtente}`, socketid: `${socketid}`, stream: false, pidstream: 0};
        utentiInConference.push([Number(idroom), elemento]);		
    }
	// INSERIRE UTENTE 
	else
    {      
      if( checkPresenzaIdRoom(idroom)>=0 && (!checkPresenzaIdUtente(idroom, idutente)) ){            
		//UTENTE NON PRESENTE --> INSERIRE UTENTE NELL'ARRAY !          
         console.log("Utente NON presente inserire utente nell'ARRAY"); 
	     elemento = {idutente: `${idutente}`, nome: `${nomeUtente}`, socketid: `${socketid}`, stream: false, pidstream: 0};                    
         utentiInConference[checkPresenzaIdRoom(idroom)].push(elemento);
      }	   
    }   
    
	let userInConferenceVideo = utentiInConference;
    return userInConferenceVideo;
}

//----------------------------- ELIMINAZIONE ELEMENTO

let deleteRow = function (arr: any, row: any) {     
    arr = arr.slice(0); // make copy
    arr.splice(row - 1, 1);
    return arr;
 }


let deleteUser = function (socketid: string){
    
    let userInConferenceVideo = utentiInConference
    let socketidCoo=checkPresenzaSocketid(socketid);
    
    console.log('Index room del socketid: ' + socketidCoo);    
    console.log("Eliminare partecipante dall'array");

    //Eliminazione oggetto 
    let el = utentiInConference[socketidCoo.y].splice(socketidCoo.x,1);   
    
    //Verificare se la room è vuota e nel caso eliminarla
    if(utentiInConference[socketidCoo.y].length==1){   
        console.log("Eliminazione Room")     
        userInConferenceVideo=deleteRow(utentiInConference,socketidCoo.y+1);        
    }
    else
    {
        //La room non è vuota e si seleziona l'array monodimensionale specifico della stanza
        userInConferenceVideo =  utentiInConference[socketidCoo.y];
    }
  
    return userInConferenceVideo; 
}

//----------------- UPDATE STREAM FALSE/TRUE -----------------------------------

function updatePidStream(socketid: string, pidstream: number){ 
    let socketidCoo=checkPresenzaSocketid(socketid);
    utentiInConference[socketidCoo.y][socketidCoo.x]['pidstream'] = pidstream;  
    return utentiInConference[socketidCoo.y];
} 

function updateStreamFalse(socketid: string){ 
    let socketidCoo=checkPresenzaSocketid(socketid);
    utentiInConference[socketidCoo.y][socketidCoo.x]['stream'] = false;  
    return utentiInConference[socketidCoo.y];
}  

function updateStream(socketid: string, pidstream: string){    

    let socketidCoo=checkPresenzaSocketid(socketid);    
    
    //Inizializzazione tutti gli stream a false (in pratica si fa uscire l'utente dallo streamming)
    for (let x = 1; x < utentiInConference[socketidCoo.y].length; x++) {
        /* console.log('x :' + x)
        console.log("wwww: " + utentiInConference[socketidCoo.y][x]['stream']);  */ 
        utentiInConference[socketidCoo.y][x]['stream'] = false;
        utentiInConference[socketidCoo.y][x]['pidstream'] = 0;     
    } 
   
    //aggiorna valore da stream: false a stream: true        
    utentiInConference[socketidCoo.y][socketidCoo.x]['stream'] = true;
    utentiInConference[socketidCoo.y][socketidCoo.x]['pidstream'] = pidstream;    
   
    return utentiInConference[socketidCoo.y];
}   


//------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------



let userInConferenceVideo = function (idroom: number, idutente: string, dataAction: string, socketid: string, nomeUtente: string){    
    
    let userInConferenceVideo=utentiInConference;
    
    switch (dataAction) {
        case 'entrance':
            //INSERIRE UTENTE E/O ROOM
            console.table(insertArray(idroom, idutente, socketid, nomeUtente));           
        break;

        case 'exitUser':
            //ELIMINARE UTENTE e/o ROOM            
			userInConferenceVideo = deleteUser(socketid);
			console.table(userInConferenceVideo);
        break;  
        
        /* case 'updateUserStream':
            //UPDATE STREAM UTENTE            
			userInConferenceVideo = updateArray(socketid);
			console.table(userInConferenceVideo);
        break; */
    
        default:
        break;
    }

    return userInConferenceVideo;
}

module.exports = {
    userInConferenceVideo,
    idutentesplit,
    idroomsplit,
    checkPresenzaIdRoom,
    checkPresenzaIdUtente,
    checkPresenzaSocketid,
    checkpidstream,
    insertArray,
    deleteRow,
    deleteUser,
    updatePidStream,
    updateStreamFalse,
    updateStream,
    utentiInConference
}