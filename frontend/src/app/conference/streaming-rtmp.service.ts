import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import mpegts from 'mpegts.js';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AuthUser } from '../auth/auth-user.model';
import { AlertService } from '../shared/alert.service';
import { VIDEO } from './constants';
import { GpsService } from './map/gps.service';
import { PlayerSettingsService } from './player/player-settings.service';
import { RoomUser } from './room-user.model';
import { SharedBoardService } from './shared-board/shared-board.service';

export interface Message {
  type: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class StreamingRtmpService {
  constructor(
    private socket: Socket,
    private alertService: AlertService,
    private gpsService: GpsService,
    private sbService: SharedBoardService,
    private playerSettings: PlayerSettingsService,
    private navController: NavController
  ) {}

  private mediaRecorder: MediaRecorder;
  private player: mpegts.Player;

  private localStream: MediaStream;
  private localVideo: HTMLVideoElement;
  private remoteVideo: HTMLVideoElement;

  isPlaying = false;
  isStreaming = false;
  isLoading = false;
  streamingUser: RoomUser;

  private watchersSubject = new BehaviorSubject<RoomUser[]>([]);
  watchers$ = this.watchersSubject.asObservable();

  public async configureSocket(
    localUser: AuthUser,
    roomId: number
  ): Promise<void> {
    this.localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    this.remoteVideo = document.getElementById(
      'remoteVideo'
    ) as HTMLVideoElement;

    this.socket.emit('config_rtmpDestination', {
      rtmp: `${environment.urlRTMP}/${roomId}/${localUser.idutcas}`,
      nome: localUser.nomecognome,
    });

    if (this.streamingUser) {
      await this.startPlayer(roomId, this.streamingUser.idutente);
    }

    this.socket.fromEvent<Message>('message').subscribe(
      async (msg) => {
        switch (msg.type) {
          case 'welcome':
            console.log(msg.data);
          case 'info':
          case 'fatal':
            // da decommentare per controllare il Framerate
            // console.log(msg.data)
            break;
          case `${roomId}`:
            let usersInRoom = [];
            this.streamingUser = null;
            console.log('🐱‍👤 : msg.data', msg.data);
            msg.data.slice(1).forEach((user: RoomUser) => {
              if (user.stream) {
                this.streamingUser = user;
                usersInRoom.unshift(user);
              } else {
                usersInRoom.push(user);
              }
            });
            this.watchersSubject.next(usersInRoom);
            if (!this.streamingUser) this.stopPlayer(roomId);
            break;
          case `startPlayer_${roomId}`:
            // Quando faccio streaming da occhiali il GPS deve restare attivo
            if (this.streamingUser.idutente.includes(localUser.idutcas)) {
              // se faccio streaming da occhiali (e NON ho il GPS attivo) attivo il GPS
              this.gpsService.startGps();
            } else {
              // se qualcun altro fa streaming (e ho il GPS attivo) disattivo il GPS
              this.gpsService.stopGps();
            }
            if (this.isStreaming) {
              this.stopStreaming(roomId);
            }
            await this.startPlayer(roomId, this.streamingUser.idutente);
            break;
          case `stopPlayer_${roomId}`:
            // Se nessuno fa streaming (e ho il GPS attivo) disattivo il GPS
            this.gpsService.stopGps();
            if (this.isPlaying) {
              this.stopPlayer(roomId);
              this.streamingUser = null;
            }
            break;
          case `checkUtente`:
            console.log('presenza idutente in room: ' + msg.data);
            const userAlreadyPresent = msg.data;
            if (userAlreadyPresent) {
              this.alertService.presentWarningAlert(
                `⚠️ Attenzione!`,
                `
                  <p>Il collegamento alla room ${roomId} è già aperto su un'altra scheda, browser o dispositivo.</p>
                  <h6>Si prega di proseguire sulla pagina già aperta OPPURE chiudere la precedente e di conseguenza refreshare la pagina corrente</h6>
                `,
                [
                  {
                    text: 'OK: Ho chiuso la pagina precedente e voglio restare su questa (esegue il refresh della pagina)',
                    handler: () => {
                      location.reload();
                    },
                  },
                  {
                    text: 'ANNULLA: Torna alla lista room',
                    handler: () => {
                      this.navController.navigateBack(['/rooms']);
                    },
                  },
                ]
              );
            }
            break;
          default:
          // console.log('unknown message: ', msg);
        }
      },
      (err) => console.log(err)
    );
  }

  leaveStreaming(roomId: number) {
    if (this.isStreaming) {
      this.socket.emit('disconnectStream', {});
      this.stopStreaming(roomId);
      this.streamingUser = null;
    }
    if (this.isPlaying) {
      this.stopPlayer(roomId);
    }
  }

  async toggleStreaming(roomId: number, idutcas: string, isLandscape: boolean) {
    if (!this.isLoading) {
      if (this.isStreaming) {
        this.stopStreaming(roomId);
        this.socket.emit('disconnectStream', {});
        this.streamingUser = null;
        this.gpsService.stopGps();
      } else {
        await this.startStreaming(roomId, isLandscape);
        this.socket.emit('start', { idutente: idutcas });
        this.gpsService.startGps();
      }
    }
  }

  async refreshStreaming(
    roomId: number,
    idutcas: string,
    isLandscape: boolean
  ) {
    if (this.isStreaming) {
      this.stopStreaming(roomId);
      this.socket.emit('disconnectStream', {});
      await this.startStreaming(roomId, isLandscape);
      this.socket.emit('start', { idutente: idutcas });
    }
  }

  isVideoPortrait = false;
  async startStreaming(roomId: number, isLandscape: boolean) {
    console.log('🐱‍👤 : isLandscape', isLandscape);
    if (this.isPlaying) this.stopPlayer(roomId);
    if (this.isStreaming) this.stopStreaming(roomId); // ? Necessario?

    console.log('🐱‍👤 : startStreaming', {
      isLoading: this.isLoading,
      isStreaming: this.isStreaming,
      isPlaying: this.isPlaying,
    });

    // apre la camera dell'utente
    this.isLoading = true;
    this.requestStream(isLandscape)
      .then(() => {
        this.startLocalVideo();
        this.startMediaRecorder();
        this.isVideoPortrait = window.screen.height >= window.screen.width;
        this.isStreaming = true;
        this.isLoading = false;
      })
      .catch((err: DOMException) => {
        this.isLoading = false;
        if (err.message.includes('NotAllowedError')) {
          this.alertService.presentBasicAlert(
            err.name,
            `Concedi i permessi per usare la Fotocamera al sito e Ricarica la pagina <br>
            <img src="../../../assets/permessi.png" />`,
            ['OK']
          );
        } else {
          this.alertService.presentBasicAlert(err.name, err.message, ['OK']);
        }
      });
  }

  stopStreaming(roomId: number) {
    console.log('🐱‍👤 : stopStreaming');
    // chiude la camera dell'utente
    this.stopLocalVideo();
    this.stopMediaRecorder();
    this.isStreaming = false;
    this.isLoading = false;
    if (this.sbService.isBoardVisible) {
      this.sbService.closeBoard(roomId);
    }
  }

  /************************* GetUserMedia *************************/

  private async requestStream(isLandscape: boolean): Promise<void> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // let facingMode =
      //   cameraSide === SIDE.back ? { exact: 'environment' } : null;
      // let aspectRatio = isLandscape ? 4 / 3 : 3 / 4 ;
      let aspectRatio = isLandscape ? 16 / 9 : 9 / 16;
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: this.playerSettings.selectedVideoInput.id,
            aspectRatio: aspectRatio,
            width: VIDEO.width,
            height: VIDEO.height,
            frameRate: { ideal: VIDEO.framerate },
            // facingMode: facingMode,
          },
        });
        if (!this.localStream) {
          throw new Error('No stream found');
        }
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  startLocalVideo() {
    this.localStream.getTracks().forEach((track) => {
      track.enabled = true;
      // console.log(track.getSettings());
      // console.log(track.getCapabilities());
      // console.log(track.getConstraints());
    });
    this.localVideo.srcObject = this.localStream;
  }

  stopLocalVideo() {
    this.localStream.getTracks().forEach((track) => {
      track.stop(); // senza track.stop() non si chiude la telecamera
      track.enabled = false;
    });
    this.localVideo.srcObject = undefined;
    this.localStream = null;
  }

  /************************* MediaRecorder *************************/

  startMediaRecorder() {
    this.mediaRecorder = new MediaRecorder(this.localStream);
    this.mediaRecorder.onstop = (event: Event) => {
      // console.log('media recorder stopped: ', event);
    };
    this.mediaRecorder.onstart = (event: Event) => {
      // console.log('media recorder started: ', event);
    };
    this.mediaRecorder.onpause = (event: Event) => {
      // console.log('media recorder paused: ', event);
    };
    this.mediaRecorder.onresume = (event: Event) => {
      // console.log('media recorder resumed: ', event);
    };
    this.mediaRecorder.onerror = (event: MediaRecorderErrorEvent) => {
      // console.log('media recorder error', event.error);
    };
    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      // console.log('media recorder ondataavailable', event);
      this.socket.emit('binarystream', event.data);
    };
    this.mediaRecorder.start(250);
  }

  stopMediaRecorder(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = null;
      this.mediaRecorder.onstart = null;
      this.mediaRecorder.onpause = null;
      this.mediaRecorder.onresume = null;
      this.mediaRecorder.onerror = null;
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder = null;
    }
  }

  /************************* FlvPlayer *************************/

  // https://github.com/xqq/mpegts.js
  // https://github.com/xqq/mpegts.js/blob/master/docs/livestream.md
  // https://github.com/xqq/mpegts.js/blob/master/docs/api.md#mpegtsmseplayer

  async startPlayer(roomId: number, streamId: string) {
    if (this.player || this.isPlaying) this.stopPlayer(roomId);
    if (this.isStreaming) this.stopStreaming(roomId); // ? Necessario?

    console.log('🐱‍👤 : startPlayer', {
      isLoading: this.isLoading,
      isStreaming: this.isStreaming,
      isPlaying: this.isPlaying,
    });

    this.isLoading = true;
    this.requestPlay(roomId, streamId)
      .then(() => {
        this.isVideoPortrait =
          this.remoteVideo.videoHeight >= this.remoteVideo.videoWidth;
        console.log('🐱‍👤 : this.isVideoPortrait', this.isVideoPortrait);
        this.isPlaying = true;
        this.isLoading = false;
      })
      .catch((err) => {
        this.isLoading = false;
        console.error('🐱‍👤 : err', err);
      });
  }

  stopPlayer(roomId: number) {
    console.log('🐱‍👤 : stopPlayer');
    if (this.player) {
      this.player.pause();
      this.player.unload();
      this.player.detachMediaElement();
      this.player.destroy();
      this.player = null;
      this.isPlaying = false;
      this.isLoading = false;
      if (this.sbService.isBoardVisible) {
        this.sbService.closeBoard(roomId);
      }
    }
  }

  private async requestPlay(roomId: number, streamId: string) {
    if (mpegts.getFeatureList().mseLivePlayback) {
      let flvOrigin = `${environment.urlWSS}/${roomId}/${streamId}.flv`;
      console.log('🐱‍👤 : flvOrigin', flvOrigin);
      this.player = mpegts.createPlayer(
        {
          type: 'flv',
          isLive: true,
          hasAudio: false,
          hasVideo: true,
          url: flvOrigin,
        },
        {
          enableWorker: false,
          enableStashBuffer: false,
          // stashInitialSize: 1,
          isLive: true,
          liveBufferLatencyChasing: true,
          liveBufferLatencyMaxLatency: 5.0,
          liveBufferLatencyMinRemain: 0.5,
          lazyLoad: true,
          lazyLoadMaxDuration: 3 * 60,
          lazyLoadRecoverDuration: 30,
          deferLoadAfterSourceOpen: true,
          autoCleanupSourceBuffer: true,
          autoCleanupMaxBackwardDuration: 3 * 60,
          autoCleanupMinBackwardDuration: 2 * 60,
        }
      );
      this.player.attachMediaElement(this.remoteVideo);
      this.player.load();
      await this.player.play();
    } else {
      console.log('HTTP MPEG2-TS/FLV live stream cannot work on your browser');
    }
  }
}
