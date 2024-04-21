import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import QrCreator from 'qr-creator';
import { take } from 'rxjs/operators';
import { AuthUser } from 'src/app/auth/auth-user.model';
import { Room } from 'src/app/rooms/room.service';
import { AlertService } from 'src/app/shared/alert.service';
import { environment } from 'src/environments/environment';

import { AudioRTCService } from '../audio-rtc.service';
import { FullscreenService } from '../fullscreen.service';
import { GpsService } from '../map/gps.service';
import { MapComponent } from '../map/map.component';
import { PhotoModalComponent } from '../photo-modal/photo-modal.component';
import { SharedBoardComponent } from '../shared-board/shared-board.component';
import { SharedBoardService } from '../shared-board/shared-board.service';
import { StreamingRtmpService } from '../streaming-rtmp.service';
import { PlayerSettingsService } from './player-settings.service';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';

// import FlvJs from 'flv.js';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ transform: 'scale(.1)', opacity: 0 }),
        animate('.5s ease-in', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('.5s ease-out', style({ transform: 'scale(0.1)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class PlayerComponent implements OnInit {
  @ViewChild('localVideo', { static: false }) localVideo: ElementRef;
  @ViewChild('remoteVideo', { static: false }) remoteVideo: ElementRef;
  @ViewChild(SharedBoardComponent) sharedBoard: SharedBoardComponent;
  @ViewChild(MapComponent) private map: MapComponent;
  @Input() room: Room;
  @Input() user: AuthUser;
  isMapVisible = false;
  isListOpen = false;
  isLandscape = false;
  isPip = false;

  constructor(
    private modalController: ModalController,
    private alertService: AlertService,
    public audioService: AudioRTCService,
    public streamService: StreamingRtmpService,
    public gpsService: GpsService,
    public platform: Platform,
    public sbService: SharedBoardService,
    public fullscreen: FullscreenService,
    private screenOrientation: ScreenOrientation,
    private alertController: AlertController,
    private router: Router,
    private playerSettings: PlayerSettingsService
  ) {}

  ngOnInit() {
    if (this.platform.is('mobile')) {
      // this.orientation = ORIENTATION.portrait;
      this.screenOrientation.onChange().subscribe(async () => {
        this.isLandscape = this.screenOrientation.type.includes('portrait')
          ? false
          : true;
        console.log('🐱‍👤 : this.isLandscape', this.isLandscape);
        await this.streamService.refreshStreaming(
          this.room.id,
          this.user.idutcas,
          this.isLandscape
        );
      });
    }

    this.playerSettings.initPlayerSettings();
    this.sbService.initBoard(this.room.id);
  }

  get video(): HTMLVideoElement {
    let video = this.streamService.isStreaming
      ? this.localVideo.nativeElement
      : this.remoteVideo.nativeElement;
    return video;
  }

  toggleMap() {
    this.isMapVisible = !this.isMapVisible;
    this.isPip = this.isMapVisible;
    if (this.sbService.isBoardVisible) {
      this.sbService.closeBoard(this.room.id);
    }
    this.map.updateSize();
  }

  toggleFullscreen() {
    this.isMapVisible = this.isPip = false;
    if (this.sbService.isBoardVisible) {
      this.sbService.clearCanvasBoard(this.room.id);
    }
    this.fullscreen.toggle();
  }

  openSettings() {
    this.modalController
      .create({
        component: SettingsModalComponent,
        backdropDismiss: false,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((res) => {
        if (res.role == 'ok') {
          this.streamService.refreshStreaming(
            this.room.id,
            this.user.idutcas,
            this.isLandscape
          );
          this.audioService.switchAudioInputSource(this.user.idutcas);
        }
      });
  }

  capturePhoto() {
    let drawImage: any;
    if (this.sbService.isBoardVisible) {
      drawImage = this.sharedBoard.exportCanvasImage();
    }
    let canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    let ctx = canvas.getContext('2d');

    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    let dataURI = canvas.toDataURL('image/jpeg');

    console.log('🐱‍👤 : video', this.video);
    this.gpsService.coordinate$.pipe(take(1)).subscribe((coordinates) => {
      console.log('🐱‍👤 : coordinates', coordinates);
      this.modalController
        .create({
          component: PhotoModalComponent,
          backdropDismiss: false,
          componentProps: {
            WIDTH: this.video.videoWidth,
            HEIGHT: this.video.videoHeight,
            originalImage: dataURI,
            room: this.room,
            user: this.user,
            coordinates: coordinates,
            drawImage: drawImage,
          },
        })
        .then((modalEl) => {
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        .then((res) => {
          if (res.role == 'ok') {
            this.showAlert();
          }
        });
    });
  }

  generateQrCode() {
    let text = {
      socketUrl: environment.apiUrl.split(':')[2],
      rtmpUrl: environment.urlRTMP.split(':')[2],
      roomId: this.room.id,
      userId: this.user.idutcas,
      roomName: this.room.progetto,
    };

    this.alertService.presentBasicAlert(
      `Avvia gli SmartGlasses e scansiona il QR Code`,
      `</br><div id="qr-code"></div>`,
      ['OK', 'ANNULLA'],
      'qr-alert',
      () => {
        QrCreator.render(
          {
            text: JSON.stringify(text),
            radius: 0,
            ecLevel: 'H',
            fill: '#000000',
            background: '#FFFFFF',
            size: 200,
          },
          document.querySelector('#qr-code')
        );
      }
    );
  }

  showAlert() {
    let urlGallery = '/gallery/' + this.room.id + '/' + this.room.progetto;
    this.alertController
      .create({
        header: 'Foto salvata in galleria',
        buttons: [
          {
            text: 'Galleria',
            role: 'dismiss',
            handler: () => {
              this.router.navigateByUrl(urlGallery);
            },
          },
          {
            text: 'Okay',
            role: 'dismiss',
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }
}
