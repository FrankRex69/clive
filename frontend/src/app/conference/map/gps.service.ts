import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import Geolocation from 'ol/Geolocation';
import * as olProj from 'ol/proj';
import { BehaviorSubject } from 'rxjs';

import { EPSG4326 } from './map-data.service';

export interface GpsCoordinates {
  latitude: string;
  longitude: string;
}

@Injectable({
  providedIn: 'root',
})
export class GpsService {
  constructor(private socket: Socket) {}

  private geolocation: Geolocation;

  coordinateSubject = new BehaviorSubject<GpsCoordinates>(null);
  coordinate$ = this.coordinateSubject.asObservable();

  isGpsOn = false;
  followOperator = true;

  initGps(roomId: number): void {
    // this.createGpsLayer(mappa);

    this.geolocation = new Geolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      tracking: false,
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: EPSG4326,
    });

    this.geolocation.on('error', function (error) {
      console.log('🐱‍👤 : error', error);
    });

    this.geolocation.on('change:position', (e) => {
      const position = e.target.getPosition();
      const coordinates = olProj.toLonLat(position, EPSG4326);
      coordinates[1] = Math.round(coordinates[1] * 10000000) / 10000000;
      coordinates[0] = Math.round(coordinates[0] * 10000000) / 10000000;
      this.coordinateSubject.next({
        latitude: coordinates[1].toString(),
        longitude: coordinates[0].toString(),
      });
      this.emitPosition(
        coordinates[1].toString(),
        coordinates[0].toString(),
        roomId
      );
    });

    this.geolocation.on('change:accuracyGeometry', (e) => {
      // !! this.accuracy.setGeometry(e.target.getAccuracyGeometry());
    });

    this.socket
      .fromEvent<{ longitudine: string; latitudine: string }>(
        'gpsUtente_idroom_' + roomId
      )
      .subscribe((gpsRemote) => {
        let coordinates = [+gpsRemote.longitudine, +gpsRemote.latitudine];
        this.coordinateSubject.next({
          latitude: coordinates[1].toString(),
          longitude: coordinates[0].toString(),
        });
      });
  }

  emitPosition(lat: string, long: string, idroom: number): void {
    this.socket.emit('gps', {
      idroom: idroom,
      latitudine: lat,
      longitudine: long,
    });
  }

  toggleGps(): void {
    if (this.geolocation) {
      this.isGpsOn = !this.isGpsOn;
      this.geolocation.setTracking(this.isGpsOn);
    }
  }

  startGps() {
    if (this.geolocation && !this.isGpsOn) {
      this.isGpsOn = true;
      this.geolocation.setTracking(true);
    }
  }

  stopGps() {
    if (this.geolocation && this.isGpsOn) {
      this.isGpsOn = false;
      this.geolocation.setTracking(false);
    }
  }

  togglefollowOperator(): void {
    this.followOperator = !this.followOperator;
    console.log('🐱‍👤 : this.followOperator', this.followOperator);
  }
}
