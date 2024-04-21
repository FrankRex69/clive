const CryptoJS = require("crypto-js");

//Db Host
const dbhostciphertext = 'U2FsdGVkX1/C0SQr5N/Iz1k08R4EuEpiyynGd6hrTww=';
const bytesdbhost  = CryptoJS.AES.decrypt(dbhostciphertext, 'Ke8u/*fY66&jsk2UUqs2W');
const dbhostDecryp = bytesdbhost.toString(CryptoJS.enc.Utf8);
exports.dbhost = dbhostDecryp;

//Db Username
const dbusernameciphertext = 'U2FsdGVkX1/5vpnPZssh6hBUK/NojuvucRartdIvut0=';
const bytesdbusername  = CryptoJS.AES.decrypt(dbusernameciphertext, 'Ke8u/*fY66&//yoojsk2UUqs2W');
const dbusernameDecryp = bytesdbusername.toString(CryptoJS.enc.Utf8);
exports.dbusername = dbusernameDecryp;

//Db Password
const dbpasswordciphertext = 'U2FsdGVkX18V+P/XMCSTXIFKqin2Of/RhvGFYDmaqGE=';
const bytesdbpassword  = CryptoJS.AES.decrypt(dbpasswordciphertext, 'Ke8u/*fY66&//yoo1js&%s)Iqs2W');
const dbpasswordDecryp = bytesdbpassword.toString(CryptoJS.enc.Utf8);
exports.dbpassword = dbpasswordDecryp;

let dbnameciphertext: any;
if (process.env.NODE_ENV == 'production') {
  require('dotenv').config();
  dbnameciphertext = process.env.DBNAMECIPHERTEXT || 'U2FsdGVkX1+jdioNkaqEt63uc5hU6DDhrcvp4Gu7Cxs=';
}
else
{
   dbnameciphertext = 'U2FsdGVkX1//81K8b0Eb/yIyOydA4A32GUfNBsDoT+s=';
}
const bytesdbname  = CryptoJS.AES.decrypt(dbnameciphertext, 'Ke8u/*fY!!66&Y/yoo£eE2W');
const dbnameDecryp = bytesdbname.toString(CryptoJS.enc.Utf8);
exports.db = dbnameDecryp;



//------------------------------- Postgresql Gis ----------------------------------------------

//Host collaudoLive
const hostciphertext ='U2FsdGVkX1+16T9ITwfJ9WEyFZXBN+zgmFMKsf9x0lM=';
const byteshost  = CryptoJS.AES.decrypt(hostciphertext, 'secret key 123');
const hostDecrypColl = JSON.parse(byteshost.toString(CryptoJS.enc.Utf8));
exports.hostDecrypColl = hostDecrypColl;

//Port collaudoLive
const portciphertext ='U2FsdGVkX19Wx5sgbMsYBZbobRYS4q0LYWlSCXTBslQ=';
const bytesport  = CryptoJS.AES.decrypt(portciphertext, 'secret key 123');
const portDecrypColl = JSON.parse(bytesport.toString(CryptoJS.enc.Utf8));
exports.portDecrypColl = portDecrypColl;

//DbName collaudoLive
const dbnciphertext ='U2FsdGVkX1+4ugXYB1RV/o7My0uFhf+E+onh+OgO1kffD9ruJ/LaEwWvsSxy2XiR';
const bytesdbn  = CryptoJS.AES.decrypt(dbnciphertext, 'secret key 123');
const dbnDecrypColl = JSON.parse(bytesdbn.toString(CryptoJS.enc.Utf8));
exports.dbnDecrypColl = dbnDecrypColl;

//User CollaudoLive
const userciphertext ='U2FsdGVkX1/tv0nUUe71mrXvxPG1kaoaU50qi+4vy5w=';
const bytesuser  = CryptoJS.AES.decrypt(userciphertext, 'secret key 123');
const userDecrypColl = JSON.parse(bytesuser.toString(CryptoJS.enc.Utf8));
exports.userDecrypColl = userDecrypColl

//Pass collaudoLive
const pwdciphertext ='U2FsdGVkX1/EEYRqmQqvSUEpZQKlzapXV8ft+ErvURI=';
const bytespwd  = CryptoJS.AES.decrypt(pwdciphertext, 'secret key 123');
const pwDecrypColl = JSON.parse(bytespwd.toString(CryptoJS.enc.Utf8));
exports.pwDecrypColl = pwDecrypColl;

//-----------------------------------------------------------


//Host gisfo
const hostciphertextgis ='U2FsdGVkX1+uuWsfDn6Dai64v1zGZoq7M+z5vnhZv7I=';
const byteshostgis  = CryptoJS.AES.decrypt(hostciphertextgis, 'secret key 123');
const hostDecrypGis = JSON.parse(byteshostgis.toString(CryptoJS.enc.Utf8));
exports.hostDecrypGis = hostDecrypGis;

//Port gisfo
const portciphertextgis ='U2FsdGVkX1/GhzYQYuCu/Os5cfU1giNkWJqu1IIMwkE=';
const bytesportgis  = CryptoJS.AES.decrypt(portciphertextgis, 'secret key 123');
const portDecrypGis = JSON.parse(bytesportgis.toString(CryptoJS.enc.Utf8));
exports.portDecrypGis = portDecrypGis;

//DbName gisfo
const dbnciphertextgis ='U2FsdGVkX1/3ECvX4dhfTUKhQ4QUFkxVf30r0Pe6TEQ=';
const bytesdbngis  = CryptoJS.AES.decrypt(dbnciphertextgis, 'secret key 123');
const dbnDecrypGis = JSON.parse(bytesdbngis.toString(CryptoJS.enc.Utf8));
exports.dbnDecrypGis = dbnDecrypGis;

//User gisfo
const userciphertextgis ='U2FsdGVkX18NItwEFwERAwKLFdEkzBnCDTEKWksg95w=';
const bytesusergis  = CryptoJS.AES.decrypt(userciphertextgis, 'secret key 123');
const userDecrypGis = JSON.parse(bytesusergis.toString(CryptoJS.enc.Utf8));
exports.userDecrypGis = userDecrypGis

//Pass gisfo
const pwdciphertextgis ='U2FsdGVkX19O+0oL73/pvNOtQCJHFDUABdoKXRx3D3o=';
const bytespwdgis  = CryptoJS.AES.decrypt(pwdciphertextgis, 'secret key 123');
const pwDecrypGis = JSON.parse(bytespwdgis.toString(CryptoJS.enc.Utf8));
exports.pwDecrypGis = pwDecrypGis;

