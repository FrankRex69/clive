import express from 'express';

const controllerTest = require('./ctrl/controllerTest');

const controllerAlfaNumCasuale = require('./ctrl/controllerAlfaNumCasuale');
const controllerDownloadZip = require('./ctrl/controllerDownloadZip');
const controllerLogin = require('./ctrl/controllerLogin');
const controllerSincroDb = require('./ctrl/controllerSincroDb');
const controllerToken = require('./ctrl/controllerToken');
const controllerVidApp = require('./ctrl/controllerVidApp');
const controllerVarie = require('./ctrl/controllerVarie');

const controllerSelect = require('./ctrl/controllerSelect');
const controllerUpdate = require('./ctrl/controllerUpdate');
const controllerDelete = require('./ctrl/controllerDelete');
const controllerCreate = require('./ctrl/controllerCreate');

const mid = require('./middleware/mid');

const router = express.Router();
const cors = require('cors');

//__________________________________________________________________________________

router.use(cors());

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------
//Test
router.get('/test/', controllerTest.test);
//Test-Webrtc
router.get('/test-webrtc/');

//--------------------------------------------------------------------

//Check galleria foto
router.get('/checkGalleria/:idroom', [mid.checkAuth], controllerVarie.getCheckGalleria);

//Downloadzip (download foto compresse)
router.get('/checkdownloadzip/:folderzip/', controllerDownloadZip.CheckDownloadZip);
router.get('/downloadzip/:folderzip/', controllerDownloadZip.DownloadZip);

//Login/usermobile
router.post('/lgn/', [mid.checkAuth], controllerLogin.checkLogin);
router.post('/pltklgn/', [mid.checkAuth], controllerLogin.decodeToken);
router.post('/checkum/', [mid.checkAuth], controllerLogin.checkUserMobile);

//MappaProgetto
router.get('/mappaProgetto/:idroom', [mid.checkAuth], controllerVarie.mappaProgetto);

//SincroDb
router.get('/alfanumcasuale/', [mid.checkAuth], controllerAlfaNumCasuale.getAlfaNumeCasuale);
router.get('/sincrodb/:idutente?/:drawing?/:codicecasuale', [mid.checkAuth], controllerSincroDb.sincroDb);
router.get('/checksincrodb/:codicecasuale', [mid.checkAuth], controllerSincroDb.sincroDbCheck);

//Token
router.post('/token/', controllerToken.getToken);

//VidApp (riavvio Node Media Server)
router.get('/vidapp/', [mid.checkAuth], controllerVidApp.VidApp);


//------------------------------------------------------------------------
//----------- API-db -----------------------------------------------------
//------------------------------------------------------------------------

//Indirizzamento ad API-db di lettura (SELECT)
/* router.get('/s/:table/:idutcas?/:idroom?/:idroom?/:pagGall?', [mid.checkAuth], controllerSelect.getSelect); */
router.get('/s/:table/:idutcas?/:idroom?/:pagGall?/:numberFotoPage?', [mid.checkAuth], controllerSelect.getSelect);

//Indirizzamento ad API-db di modifica (UPDATE)
router.put('/ur/', [mid.checkAuth], controllerUpdate.putUpdateRoom);
router.put('/uu/', [mid.checkAuth], controllerUpdate.putUpdateUtenti);
router.put('/up/', [mid.checkAuth], controllerUpdate.putUpdateProgetti);
router.put('/uc/', [mid.checkAuth], controllerUpdate.putUpdateCommesse);
router.put('/ug/', [mid.checkAuth], controllerUpdate.putUpdateGalleria);

//Indirizzamento ad API-db di eliminazione (DELETE)
router.post('/d/', [mid.checkAuth], controllerDelete.delete);

//Indirizzamento ad API-db di creazione (POST)
router.post('/cu/', [mid.checkAuth], controllerCreate.postCreateUtenti);
router.post('/cp/', [mid.checkAuth], controllerCreate.postCreateProgetti);
router.post('/cr/', [mid.checkAuth], controllerCreate.postCreateRoom);
router.post('/cc/', [mid.checkAuth], controllerCreate.postCreateCommessa);
router.post('/cph/', [mid.checkAuth], controllerCreate.postCreateCaptphoto);
//------------------------------------------------------------------------

module.exports = router;