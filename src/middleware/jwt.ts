let jwt = require('jsonwebtoken');
import fs from 'fs';

let option = {
    algorithm: "RS256",
    expiresIn: 60*60*24
}

let getPayload = (token: any) => {
    let decode = jwt.decode(token, {complete: true});
    return decode.payload;
}
        
let setToken = (username: any, password: any, idutente: any, idcommessa: any, autorizzazione: any, idutcas: any, nomecognome: string, commessanome: any, btnStream: boolean, btnCpt: boolean, btnGall: boolean, btnGallDel: boolean, btnGallUpdate: boolean, btnGallDownload: boolean, btnInsMkr: boolean, btnDelMkr: boolean, btnGpsOn: boolean, btnBkoff: boolean, btnRooms: boolean, btnBoard: boolean)=>{
    let payload = {idutente: idutente, idutcas: idutcas, nomecognome: nomecognome, username: username, idcommessa: idcommessa, commessa: commessanome, autorizzazione: autorizzazione, btnStream: btnStream, btnCpt: btnCpt, btnGall: btnGall, btnGallDel: btnGallDel, btnGallUpdate: btnGallUpdate, btnGallDownload: btnGallDownload, btnInsMkr: btnInsMkr, btnDelMkr: btnDelMkr, btnGpsOn: btnGpsOn, btnBkoff: btnBkoff, btnRooms: btnRooms, btnBoard: btnBoard};
    //console.log(payload)
    let chiaveprivata = fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem');
    let token = jwt.sign(payload, chiaveprivata, option);
    return token;
}

let checkToken = (token: any) => {
    let chiavePubblica = fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem');
    return jwt.verify(token, chiavePubblica, option)
}

module.exports = {
    setToken,
    getPayload,
    checkToken
}