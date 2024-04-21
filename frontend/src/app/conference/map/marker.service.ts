import { Injectable, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { AuthUser } from 'src/app/auth/auth-user.model';

export interface MarkerCoordinates {
  latitude: string;
  longitude: string;
}

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private socket: Socket) {}

  isMarkerBluOn: Boolean = false;

  markerSubject = new BehaviorSubject<MarkerCoordinates>(null);
  marker$ = this.markerSubject.asObservable();

  initMarker(roomId: number): void {
    this.socket.on('deleteMarkerIndicazioni' + roomId, () => {
      this.markerSubject.next(null);
      this.isMarkerBluOn = false;
    });

    this.socket
      .fromEvent<{ longitudine: string; latitudine: string }>(
        'posMkrBckEnd_' + roomId
      )
      .subscribe((markerData) => {
        let coordMarkerBlu = [+markerData.longitudine, +markerData.latitudine];
        this.markerSubject.next({
          latitude: coordMarkerBlu[1].toString(),
          longitude: coordMarkerBlu[0].toString(),
        });
        this.isMarkerBluOn = false;
      });
  }

  emitMarker(lat: string, long: string, idroom: number) {
    this.isMarkerBluOn = true;
    this.markerSubject.next({
      latitude: lat,
      longitude: long,
    });
    this.socket.emit('posizioneMarker', {
      idroom: idroom,
      latitudine: lat,
      longitudine: long,
    });
  }

  emitDeletMarker(roomId: number) {
    this.isMarkerBluOn = false;
    this.markerSubject.next(null);
    this.socket.emit('deleteMarkerIndicazioni', { roomId: roomId });
  }
}
