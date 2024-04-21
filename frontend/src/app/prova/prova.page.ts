import { Component, OnInit } from '@angular/core';
import { promise } from 'protractor';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-prova',
  templateUrl: './prova.page.html',
  styleUrls: ['./prova.page.scss'],
})
export class ProvaPage implements OnInit {
  constructor(private socket: Socket) {}

  ngOnInit() {
    window.setInterval(() => this.getLocation(), 5000);
  }

  async getLocation() {
    let sP = this.showPosition;
    navigator.geolocation.getCurrentPosition(sP);
    //this.configureSocket();
  }

  async showPosition(position: {
    coords: { latitude: number; longitude: number };
  }) {
    //Parte per coordinate random
    function randomCoord(coordinataIni: any) {
      console.log(coordinataIni);
      let coordinata = Number.parseFloat(coordinataIni).toFixed(4);
      //let coordinata = coordinataIni.toFixed(4);
      let coordRandom = (Math.random() * 180).toFixed(6);
      const baseDecimRandom = coordRandom.split('.');
      let base = baseDecimRandom[1];
      let lunghBase = base.length;
      const decimNew = base.substring(3, lunghBase);

      let finale = coordinata + decimNew;

      return finale;
    }

    let datalat: any = position.coords.latitude.toFixed(7);
    let datalong: any = position.coords.longitude.toFixed(7);
    let lat = randomCoord(datalat);
    let long = randomCoord(datalong);

    let node = document.createElement('LI');
    let textnode = document.createTextNode('Lat: ' + lat + ' - Long: ' + long);
    node.appendChild(textnode);
    document.getElementById('demo').appendChild(node);
  }

  /*  // Funzione per comunicazione socket-gps
   configureSocket(long): void {

    // GPS EMIT --------------------------------
    this.socket.emit('gps', {
      idroom: 1180,
      idutente: 1127,
      latitudine: 3337,
      longitudine: long    
    });

    // GPS ON --------------------  
    this.socket.fromEvent<any>('gps').subscribe(
      (msgGps) => {
        switch (msgGps.type) { 
          case `gps_idroom_1180`:        
            console.log('msgGps.idroom2: ', msgGps.idroom);
            console.log('msgGps.idutente2: ', msgGps.idutente);
            console.log('msgGps.latitudine2: ', msgGps.latitudine);
            console.log('msgGps.longitudine2: ', msgGps.longitudine);
            break;
          default:
            console.log('unknown GPS message2: ', msgGps);
        }
      
      }
    )
    //---------------------------------------------------

   } */
}
