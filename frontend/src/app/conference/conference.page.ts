import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import NoSleep from 'nosleep.js';
import { fromEvent, iif, Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  retryWhen,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { setTimeout } from 'timers';

import { AuthUser } from '../auth/auth-user.model';
import { AuthService } from '../auth/auth.service';
import { RoomFunctionsService } from '../rooms/room-list/room-functions.service';
import { Room, RoomService } from '../rooms/room.service';
import { AudioRTCService } from './audio-rtc.service';
import { ChatService } from './chat/chat.service';
import { FullscreenService } from './fullscreen.service';
import { MapComponent } from './map/map.component';
import { PlayerComponent } from './player/player.component';
import { StreamingRtmpService } from './streaming-rtmp.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.page.html',
  styleUrls: ['./conference.page.scss'],
})
export class ConferencePage implements OnInit, OnDestroy {
  destroy$ = new Subject();

  @ViewChild(PlayerComponent) public player2: PlayerComponent;
  @ViewChild(MapComponent) private map: MapComponent;

  public room: Room;
  public user: AuthUser;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private roomService: RoomService,
    private authService: AuthService,
    private socket: Socket,
    private router: Router,
    public platform: Platform,
    public roomFunctions: RoomFunctionsService,
    public audioService: AudioRTCService,
    public streamService: StreamingRtmpService,
    public fullscreen: FullscreenService,
    public chat: ChatService
  ) {}

  isMobile: boolean = false;
  isLoading: boolean = false;
  isVideoVisible: boolean = true;
  isMapVisible: boolean = true;
  isPartecipantVisible: boolean = true;

  selectedTab: string = 'call';
  segmentChanged(event: CustomEvent) {
    switch (event.detail.value) {
      case 'call':
        this.isVideoVisible = true;
        this.chat.isVisible = this.isMapVisible = false;
        break;
      case 'mappa':
        this.map.updateSize();
        this.isMapVisible = true;
        this.chat.isVisible = this.isVideoVisible = false;
        break;
      case 'chat':
        this.chat.isVisible = true;
        this.isVideoVisible = this.isMapVisible = false;
        this.chat.resetNotification();
        break;
    }
  }

  toggleMappa() {
    if (this.isVideoVisible) {
      this.isMapVisible = !this.isMapVisible;
    }
    if (this.isMapVisible) {
      this.map.updateSize();
    }
  }

  toggleVideo() {
    if (this.isMapVisible) {
      this.isVideoVisible = !this.isVideoVisible;
      this.map.updateSize();
    }
  }

  toggleParticipant() {
    this.isPartecipantVisible = true;
    this.chat.isVisible = false;
  }

  toggleChat() {
    this.chat.isVisible = true;
    this.isPartecipantVisible = false;
    this.chat.resetNotification();
  }

  switchToMobile() {
    if (!this.isMobile) {
      console.log('🐱‍👤 : switchToMobile');
      this.isMobile = true;
      this.isVideoVisible = true;
      this.isMapVisible = false;
      this.chat.isVisible = false;
      this.isPartecipantVisible = true;
      this.selectedTab = 'call';
    }
  }

  switchToDesktop() {
    if (this.isMobile) {
      console.log('🐱‍👤 : switchToDesktop');
      this.isMobile = false;
      this.isVideoVisible = true;
      this.isMapVisible = true;
      this.chat.isVisible = false;
      this.isPartecipantVisible = true;
    }
  }

  resizeObservable$: Observable<Event> = fromEvent(window, 'resize');

  ngOnInit() {
    /* SUBSCRIBE AL RESIZE DELLA PAGINA PER AGGIORNARE LA PAGINA  */

    this.resizeObservable$
      .pipe(
        map((event) => {
          const window = event.target as Window;
          return window.innerWidth;
        }),
        startWith(window.innerWidth),
        distinctUntilChanged(),
        tap((width) => {
          if (width >= 992) {
            this.switchToDesktop();
          } else {
            this.switchToMobile();
          }
        }),
        debounceTime(600),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.map.updateSize();
      });

    if (this.platform.is('mobile')) {
      let noSleep = new NoSleep();
      noSleep.enable();
      this.switchToMobile();
    }

    /*
     * Recupera l'ID della room dall'URL,
     * l'utente corrente dall'authService,
     * i dati completi della room dal backend
     * e configura il socket per la room corrente
     */
    this.isLoading = true;
    this.activatedRoute.paramMap
      .pipe(
        switchMap((paramMap) => {
          if (!paramMap.has('roomId')) {
            throw new Error('Missing Room ID');
          }
          let roomId = paramMap.get('roomId');
          this.router.navigate([], {
            replaceUrl: true,
            relativeTo: this.activatedRoute,
          });
          return this.roomService.selectRoom(+roomId);
        }),
        switchMap((room: Room) => {
          if (!room) {
            throw new Error('Room Not Found');
          }
          this.room = room;
          return this.authService.currentUser$;
        }),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (user: AuthUser) => {
          this.user = user;
          this.socket.emit('first_idroom', this.room.id);
          this.isLoading = false;
        },
        (err) => {
          this.navController.navigateBack(['/not-found']);
          this.isLoading = false;
        }
      );

    this.socket
      .fromEvent<any>('lista_utenti')
      .pipe(
        tap((utentiInConference) => {
          if (utentiInConference) {
            utentiInConference.slice(1).forEach((user) => {
              if (user.stream == true) {
                this.streamService.streamingUser = user;
              }
            });
          }
        }),
        switchMap((utentiInConference) =>
          iif(
            () => this.user.idutcas !== 'guest',
            of(this.user.idutcas),
            this.checkIdGuest(utentiInConference, this.user.idutcas)
          )
        ),
        switchMap((userId: string) =>
          iif(
            () => userId !== this.user.idutcas,
            this.authService.updateGuest(userId),
            of(this.user)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (user: AuthUser) => {
          this.user = user;
          this.streamService.configureSocket(this.user, this.room.id);
        },
        (err) => {
          console.log('subscribe : err', err);
        }
      );

    // setTimeout(() => {
    //   console.log('UTENTE: btn galleria', this.user.btnStream);
    // }, 2000);
  }

  goBack() {
    this.roomService.deselectRoom();
    this.navController.navigateBack(['/rooms']);
  }

  ngOnDestroy() {
    if (this.room) {
      this.streamService.leaveStreaming(this.room.id);
      this.audioService.leaveRoom(this.room.id.toString());
    }
    this.destroy$.next();
  }

  checkIdGuest(utentiInConference: any, userId: string): Observable<string> {
    return of(utentiInConference).pipe(
      switchMap((utentiInConference) => {
        if (!utentiInConference) {
          userId = `guest_${this.generateRandomId(12)}`;
          // userId = `guest_${Math.floor(Math.random() * 3)}`;
          return of(userId);
        } else {
          return of(utentiInConference.slice(1)).pipe(
            map((users) => {
              userId = `guest_${this.generateRandomId(12)}`;
              // userId = `guest_${Math.floor(Math.random() * 3)}`;
              // console.log('🐱‍👤 : NEW userId:', userId);
              for (let user of users) {
                if (user['idutente'] == userId) {
                  throw userId;
                }
              }
              return userId;
            }),
            retryWhen((errors) =>
              errors.pipe(tap((id) => console.log(`User ${id} already exist!`)))
            )
          );
        }
      })
    );
  }

  generateRandomId(length: number): string {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    // console.log('🐱‍👤 generateRandomId : result', result);
    return result;
  }
}
