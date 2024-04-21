import { Component, OnInit } from '@angular/core';
import { setInterval } from 'timers/promises';

import { Socket } from 'ngx-socket-io';
import { bindCallback } from 'rxjs';

@Component({
  selector: 'app-test-gps',
  templateUrl: './test-gps.page.html',
  styleUrls: ['./test-gps.page.scss'],
})
export class TestGpsPage implements OnInit {
  constructor(private socket: Socket) {}

  ngOnInit() {
    window.setInterval(() => this.getLocation(), 5000);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    } else {
      document.getElementById('demo').innerHTML =
        'Geolocation is not supported by this browser.';
    }
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

    //Comunicazioni socket-gps
    this.configureSocket(lat, long);
  }

  // Funzione per comunicazione socket-gps
  public configureSocket(lat: any, long: any): void {
    // GPS EMIT --------------------------------
    this.socket.emit('gps', {
      idroom: 1180,
      idutente: 112,
      latitudine: lat,
      longitudine: long,
    });

    // GPS ON --------------------
    this.socket.fromEvent<any>('gps').subscribe((msgGps) => {
      switch (msgGps.type) {
        case `gps_idroom_1180`:
          console.log('msgGps.idroom: ', msgGps.idroom);
          console.log('msgGps.idutente: ', msgGps.idutente);
          console.log('msgGps.latitudine: ', msgGps.latitudine);
          console.log('msgGps.longitudine: ', msgGps.longitudine);
          break;
        default:
          console.log('unknown GPS messageError: ', msgGps);
      }
    });
    //---------------------------------------------------
  }
}
