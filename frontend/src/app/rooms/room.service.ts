import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';

/** Interfaccia che definisce la Room come mi arriva sul JSON */
export interface RoomData {
  id: number;
  usermobile: string;
  DataInsert: string;
  cod: string;
  progettoselezionato: string;
  dataLastsincro: string;
  idutente: number;
  collaudatoreufficio: string;
  idcommessa: number;
  commessa: string;
}

/** Interfaccia che definisce la Room all'interno del progetto */
export interface Room {
  id: number;
  usermobile: string;
  data_inserimento: Date;
  pk_project: string;
  progetto: string;
  data_sincronizzazione: Date;
  idutente: number;
  collaudatore: string;
  idcommessa: number;
  commessa: string;
  sessione: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private roomsSubject = new BehaviorSubject<Room[]>([]); // <-- "roomsSubject" può emettere eventi perchè è un BehaviourSubject
  rooms$: Observable<Room[]> = this.roomsSubject.asObservable(); // <-- "rooms$" NON può emettere eventi, ma può essere sottoscritto, perchè è un Observable

  private currentRoomSubject = new BehaviorSubject<Room>(null); // <-- "roomsSubject" può emettere eventi perchè è un BehaviourSubject
  currentRoom$: Observable<Room> = this.currentRoomSubject.asObservable(); // <-- "rooms$" NON può emettere eventi, ma può essere sottoscritto, perchè è un Observable

  getRoom(roomId: number): Observable<Room> {
    return this.rooms$.pipe(
      take(1),
      // <-- applico una funzione di filtro all'array di room che ho preso con take(1)
      map((rooms: Room[]) => {
        // <-- ritorna vero quando trova il progeto giusto
        return { ...rooms.find((room) => room.id === roomId) };
      })
    );
  }

  getRoomsByFilter(query: string): Observable<Room[]> {
    return this.rooms$.pipe(
      map((rooms) =>
        rooms.filter(
          (room) =>
            room.usermobile.toLowerCase().includes(query.toLowerCase()) ||
            room.commessa.toLowerCase().includes(query.toLowerCase()) ||
            room.progetto
              .toString()
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            room.collaudatore
              .toString()
              .toLowerCase()
              .includes(query.toLowerCase())
        )
      )
    );
  }

  /** SELECT singola room */
  selectRoom(roomId: number): Observable<Room> {
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap((user) => {
        // return this.http.get<RoomData>(`${environment.apiUrl}/s/room/${user.idutcas}/${roomId}`);
        return this.http.get<RoomData>(
          `${environment.apiUrl}/s/room/0/${roomId}`
        );
      }),
      map((roomData) => {
        return {
          id: roomData[0].id,
          usermobile: roomData[0].usermobile,
          data_inserimento: new Date(roomData[0].DataInsert),
          pk_project: roomData[0].cod,
          progetto: roomData[0].progettoselezionato,
          data_sincronizzazione: new Date(roomData[0].dataLastsincro),
          idutente: roomData[0].idutente,
          collaudatore: roomData[0].collaudatoreufficio,
          idcommessa: roomData[0].idcommessa,
          commessa: roomData[0].commessa,
          sessione: 'Mattina',
        };
      }),
      // <-- emette il nuovo array come valore del BehaviourSubject _rooms
      tap((room: Room) => this.currentRoomSubject.next(room))
    );
  }

  deselectRoom() {
    this.currentRoomSubject.next(null);
  }

  /** SELECT rooms */
  loadRooms(): Observable<Room[]> {
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          throw new Error('User non autenticato');
        }
        return this.http.get<{ [key: string]: RoomData }>(
          `${environment.apiUrl}/s/room/${user.idutcas}/0`
        );
      }),
      // <-- Rimappa i dati che arrivano dal server sull'interfaccia della Room
      map((roomData: { [key: string]: RoomData }) => {
        const rooms: Room[] = [];
        for (const key in roomData) {
          // console.log("Key:", key," - ","Res[key]",res[key]);
          // resData.hasOwnProperty(key) = iterate all enumerable properties, directly on the object (not on the prototype)
          if (roomData.hasOwnProperty(key)) {
            rooms.push({
              id: roomData[key].id,
              usermobile: roomData[key].usermobile,
              data_inserimento: new Date(roomData[key].DataInsert),
              pk_project: roomData[key].cod,
              progetto: roomData[key].progettoselezionato,
              data_sincronizzazione: new Date(roomData[key].dataLastsincro),
              idutente: roomData[key].idutente,
              collaudatore: roomData[key].collaudatoreufficio,
              idcommessa: roomData[key].idcommessa,
              commessa: roomData[key].commessa,
              sessione: 'Mattina',
            });
          }
        }
        return rooms;
      }),
      // <-- emette il nuovo array come valore del BehaviourSubject _rooms
      tap((rooms: Room[]) => this.roomsSubject.next(rooms))
    );
  }

  /** CREATE room e aggiungila alla lista */
  addRoom(
    usermobile: string,
    pk_project: string,
    progetto: string,
    data_sincronizzazione: string,
    idutente: number,
    collaudatore: string,
    idcommessa: number,
    commessa: string
  ) {
    let updatedRooms: Room[];
    const newRoom = {
      id: null,
      usermobile: usermobile,
      data_inserimento: new Date(),
      pk_project: pk_project,
      progetto: progetto,
      data_sincronizzazione: new Date(data_sincronizzazione),
      idutente: idutente,
      collaudatore: collaudatore,
      idcommessa: idcommessa,
      commessa: commessa,
      sessione: 'Mattina',
    };
    // this.rooms è un OSSERVABILE
    // take(1) = dopo la prima emissione dell'Osservabile togli la sottoscrizione
    // tap() = applico una funzione all'array emesso dall'osservabile (solo 1 perchè uso take(1)) senza sottoscrivermi
    return this.rooms$.pipe(
      take(1),
      switchMap((rooms) => {
        updatedRooms = [...rooms];
        return this.http.post(`${environment.apiUrl}/cr/`, {
          usermobile: usermobile,
          progettoselezionato: progetto,
          cod: pk_project,
          collaudatoreufficio: idutente,
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        console.log('GeneratedId:', res['insertId']);
        newRoom.id = res['insertId'];
        updatedRooms.unshift(newRoom);
        // this._rooms è un BEHAVIOUR SUBJECT
        // next() = emetto il nuovo array concatencato come prossimo elemento del BehaviourSubject
        // concat(newRoom) = prendo il vecchio array emesso dall'osservabile e concateno il nuovo elemento
        this.roomsSubject.next(updatedRooms);
      })
    );
  }

  /** UPDATE room */
  updateRoom(roomId: number, newUsermobile: string) {
    let updatedRooms: Room[];
    return this.rooms$.pipe(
      take(1),
      switchMap((rooms) => {
        // findIndex() = trova l'indice di un elemento di un array in base a una regola ("se è vero")
        const roomIndex = rooms.findIndex((room) => room.id === roomId);
        updatedRooms = [...rooms];
        const oldRoom = updatedRooms[roomIndex];
        updatedRooms[roomIndex] = {
          id: oldRoom.id,
          usermobile: newUsermobile,
          data_inserimento: oldRoom.data_inserimento,
          pk_project: oldRoom.pk_project,
          progetto: oldRoom.progetto,
          data_sincronizzazione: oldRoom.data_inserimento,
          idutente: oldRoom.idutente,
          collaudatore: oldRoom.collaudatore,
          idcommessa: oldRoom.idcommessa,
          commessa: oldRoom.commessa,
          sessione: 'Mattina',
        };
        return this.http.put(`${environment.apiUrl}/ur`, {
          id: roomId,
          usermobile: newUsermobile,
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        this.roomsSubject.next(updatedRooms);
      })
    );
  }

  /** DELETE room */
  deleteRoom(roomId: number) {
    let updatedRooms: Room[];
    return this.rooms$.pipe(
      take(1),
      switchMap((rooms) => {
        // filter() = filtra un array in base a una regola ("se è vero")
        // ritrorna vero per tutte le room tranne quella che voglio scartare
        updatedRooms = rooms.filter((room) => room.id !== roomId);
        return this.http.post(`${environment.apiUrl}/d/`, {
          id: roomId,
          tableDelete: 'multistreaming',
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        this.roomsSubject.next(updatedRooms);
      })
    );
  }

  checkDownload(nomeProgetto: string) {
    return this.http.get(
      `${environment.apiUrl}/checkdownloadzip/${nomeProgetto}`
    );
  }

  downloadFoto(nomeProgetto: string) {
    return this.http.get(`${environment.apiUrl}/downloadzip/${nomeProgetto}`);
  }
}
