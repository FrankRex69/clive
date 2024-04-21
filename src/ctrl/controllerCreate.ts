import { userInfo } from 'os';

exports.postCreateUtenti = (req: any, res: any, next: any) => {
  const db = require('../conf/db');
  const alfaNumeCasuale = require('../assets/alfaNumeCasuale');  

  let sql: any = '';

  let collaudatoreufficio: any;
  let username: any;
  let password: any;
  let autorizzazioni: Number;
  let idutcas: string;
  let idcommessa: any;

  //Codice casuale
  //idutcas='qwerty';
  idutcas = alfaNumeCasuale.alfaNumeCasualeUtenti(10);

  //Controllo parametri e creazione query
  if (
    typeof req.body.collaudatoreufficio !== 'undefined' &&
    req.body.collaudatoreufficio !== null &&
    req.body.collaudatoreufficio !== ''
  ) {
    collaudatoreufficio = req.body.collaudatoreufficio;
    if (
      typeof req.body.username !== 'undefined' &&
      req.body.username !== null &&
      req.body.username !== ''
    ) {
      username = req.body.username;
      if (
        typeof req.body.password !== 'undefined' &&
        req.body.password !== null &&
        req.body.password !== ''
      ) {
        password = req.body.password;
        if (
          typeof req.body.autorizzazioni !== 'undefined' &&
          req.body.autorizzazioni !== null &&
          req.body.autorizzazioni !== '' &&
          typeof req.body.autorizzazioni === 'number'
        ) {
          autorizzazioni = req.body.autorizzazioni;
          if (
            typeof req.body.idcommessa !== 'undefined' &&
            req.body.idcommessa !== null &&
            req.body.idcommessa !== '' &&
            typeof req.body.idcommessa === 'number'
          ) {
            idcommessa = req.body.idcommessa;
            sql =
              'INSERT INTO utenti (idutcas, collaudatoreufficio, username, password, autorizzazioni, idcommessa) VALUES (?,?,?,?,?,?)';
            esecuzioneQuery(sql);
          } else {
            res.send(
              'Errore parametro autorizzazioni: vuoto, non numero , "undefined" o "null"'
            );
          }
        } else {
          res.send(
            'Errore parametro autorizzazioni: vuoto, non numero , "undefined" o "null"'
          );
        }
      } else {
        res.send('Errore parametro password: vuoto, "undefined" o "null"');
      }
    } else {
      res.send('Errore parametro username: vuoto, "undefined" o "null"');
    }
  } else {
    res.send(
      'Errore parametro collaudatoreufficio: vuoto, "undefined" o "null"'
    );
  }
  //------------------------------------
  //-------------------
  // Esecuzione query
  //-------------------
  function esecuzioneQuery(sqlInsert: any) {
    db.query(
      sqlInsert,
      [
        idutcas,
        collaudatoreufficio,
        username,
        password,
        autorizzazioni,
        idcommessa,
      ],
      (err: any, rows: any, fields: any) => {
        if (err) {
          res.send('Query error: ' + err.sqlMessage);
        } else {
          res.send(rows);
        }
      }
    );
  }
  //-----------------------------
};

exports.postCreateProgetti = (req: any, res: any, next: any) => {
  const db = require('../conf/db');
  let queryInsert: any = [];

  let messageErrore: any = '';
  let key: any;
  let valore: any = '';

  for (let attribute in req.body) {
    if (attribute == 'idutente' || attribute == 'pk_proj') {
      if (
        typeof req.body[attribute] !== 'undefined' &&
        req.body[attribute] !== null &&
        req.body[attribute] !== '' &&
        typeof req.body[attribute] === 'number'
      ) {
        queryInsert.push(req.body[attribute]);
      } else {
        {
          messageErrore =
            'Errore parametro ' +
            attribute +
            ': vuoto, "undefined", non "number" o "null"';
        }
      }
    } else {
      if (
        typeof req.body[attribute] !== 'undefined' &&
        req.body[attribute] !== null &&
        req.body[attribute] !== ''
      ) {
        queryInsert.push(req.body[attribute]);
      } else {
        {
          messageErrore =
            'Errore parametro ' + attribute + ': vuoto, "undefined" o "null"';
        }
      }
    }
  }

  // Fine ciclo-esame json => operazione da compiere
  if (messageErrore == '') {
    let sql: any =
      'INSERT INTO rappre_prog_gisfo (idutente, pk_proj, nome, nodi_fisici, nodi_ottici, tratte, conn_edif_opta, long_centro_map, lat_centro_map) VALUES (?,?,?,?,?,?,?,?,?)';

    esecuzioneQuery(sql);
  } else {
    res.send(messageErrore);
  }

  //-------------------
  function esecuzioneQuery(sqlInsert: any) {
    db.query(sqlInsert, queryInsert, (err: any, rows: any, fields: any) => {
      if (err) {
        res.send('Query error: ' + err.sqlMessage);
      } else {
        res.send(rows);
      }
    });
  }
  //-----------------------------
};

exports.postCreateRoom = (req: any, res: any, next: any) => {
  const db = require('../conf/db');
  let queryInsert: any = [];

  let messageErrore: any = '';
  let key: any;
  let valore: any = '';

  for (let attribute in req.body) {
    if (
      typeof req.body[attribute] !== 'undefined' &&
      req.body[attribute] !== null &&
      req.body[attribute] !== ''
    ) {
      queryInsert.push(req.body[attribute]);
    } else {
      {
        messageErrore =
          'Errore parametro ' + attribute + ': vuoto, "undefined" o "null"';
      }
    }
  }

  // Fine ciclo-esame json => operazione da compiere
  if (messageErrore == '') {
    let sql: any =
      'INSERT INTO multistreaming (usermobile, progettoselezionato, cod, collaudatoreufficio) VALUES (?,?,?,?)';

    esecuzioneQuery(sql);
  } else {
    res.send(messageErrore);
  }

  //-------------------
  function esecuzioneQuery(sqlInsert: any) {
    db.query(sqlInsert, queryInsert, (err: any, rows: any, fields: any) => {
      if (err) {
        res.send('Query error: ' + err.sqlMessage);
      } else {
        res.send(rows);
      }
    });
  }
  //-----------------------------
};

exports.postCreateCommessa = (req: any, res: any, next: any) => {
  const db = require('../conf/db');

  let queryInsert: any = [];
  let messageErrore: any = '';

  if (
    typeof req.body.commessa !== 'undefined' &&
    req.body.commessa !== null &&
    req.body.commessa !== ''
  ) {
    queryInsert.push(req.body.commessa);
    let sql: any = 'INSERT INTO commesse (denominazione) VALUES (?)';
    esecuzioneQuery(sql);
  } else {
    messageErrore = 'Errore parametro COMMESSA: vuoto, "undefined" o "null"';
    res.send(messageErrore);
  }

  //-----------------------------
  function esecuzioneQuery(sqlInsert: any) {
    db.query(sqlInsert, queryInsert, (err: any, rows: any, fields: any) => {
      if (err) {
        res.send('Query error: ' + err.sqlMessage);
      } else {
        res.send(rows);
      }
    });
  }
  //-----------------------------
};

exports.postCreateCaptphoto = (req: any, res: any, next: any) => {
  const db = require('../conf/db');
  let queryInsert: any = [];

  let messageErrore: any = '';
  let key: any;
  let valore: any = '';

  for (let attribute in req.body) {
    if (attribute == 'id' || attribute == 'onlynota') {
      if (
        typeof req.body[attribute] !== 'undefined' &&
        req.body[attribute] !== null &&
        typeof req.body[attribute] === 'number'
      ) {
        queryInsert.push(req.body[attribute]);
      } else {
        {
          messageErrore =
            'Errore parametro ' +
            attribute +
            ': vuoto, "undefined", non "number" o "null"';
        }
      }
    } else {
      //if(typeof(req.body[attribute]) !== 'undefined' && req.body[attribute] !== null && req.body[attribute] !== ''){
      if (
        typeof req.body[attribute] !== 'undefined' &&
        req.body[attribute] !== null
      ) {
        queryInsert.push(req.body[attribute]);
      } else {
        {
          messageErrore =
            'Errore parametro ' + attribute + ': vuoto, "undefined" o "null"';
        }
      }
    }
  }

  // Fine ciclo-esame json => operazione da compiere
  if (messageErrore == '') {
    //Inserimento foto in db;
    let sql: any =
      'INSERT INTO collaudolive (id,prodnumber,progettoselezionato,collaudatoreufficio,nameimg,latitu,longitu,nomelemento,noteimg,img,onlynota) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
    esecuzioneQuery(sql);

    //Inserimento foto in directory
    const insertPhDir = require('../assets/functionInsertPhotoDir');
    let namePhoto = req.body['nomelemento'];
    console.log(namePhoto);
    if (namePhoto != 0 || namePhoto != '') {
      namePhoto = req.body['nomelemento'] + '.jpg';
    } else {
      namePhoto = req.body['nameimg'] + '.jpg';
    }
    insertPhDir.insertPhotoDir(
      req.body['progettoselezionato'],
      namePhoto,
      req.body['img']
    );
  } else {
    res.send(messageErrore);
  }

  //-------------------
  function esecuzioneQuery(sqlInsert: any) {
    console.log(queryInsert);
    db.query(sqlInsert, queryInsert, (err: any, rows: any, fields: any) => {
      if (err) {
        res.send('Query error: ' + err.sqlMessage);
      } else {
        res.send(rows);
      }
    });
  }
  //-----------------------------
};
