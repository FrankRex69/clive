import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthUser } from 'src/app/auth/auth-user.model';
import { Room } from 'src/app/rooms/room.service';

import { MediaService } from '../../gallery/media.service';
import { BoardComponent } from '../board/board.component';
import { GpsCoordinates } from '../map/gps.service';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss'],
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
export class PhotoModalComponent implements OnInit {
  form: FormGroup = this.fb.group({
    nomeElemento: [null],
    note: [null],
  });

  @ViewChild('drawPathClient') public boardPaint: BoardComponent;

  @Input() WIDTH: number;
  @Input() HEIGHT: number;
  @Input() originalImage: string;
  @Input() room: Room;
  @Input() user: AuthUser;
  @Input() coordinates: GpsCoordinates;
  @Input() drawImage: any;
  public isBoardVisible = false;
  public date: Date;
  public idPhoto: number;
  canvas: HTMLCanvasElement;
  imgBase64: string;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private mediaService: MediaService
  ) {}

  ngOnInit() {
    this.date = new Date();
    this.idPhoto = this.date.getTime();
    if (this.originalImage) {
      this.drawImageToCanvas(this.originalImage, this.drawImage).then(
        (imgBase64) => {
          this.imgBase64 = imgBase64;
        }
      );
    }
  }

  drawImageToCanvas(image: any, path?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      let canvas: HTMLCanvasElement = document.createElement('canvas');
      let ctx = canvas.getContext('2d');

      canvas.setAttribute('height', this.HEIGHT.toString());
      canvas.setAttribute('width', this.WIDTH.toString());

      if (image) {
        let origin = new Image();
        origin.src = image;

        origin.onload = () => {
          ctx.drawImage(origin, 0, 0, this.WIDTH, this.HEIGHT);

          if (path) {
            let pathImage = new Image();
            pathImage.src = path;

            pathImage.onload = () => {
              ctx.drawImage(pathImage, 0, 0, this.WIDTH, this.HEIGHT);
              resolve(canvas.toDataURL('image/png'));
            };
          } else {
            resolve(canvas.toDataURL('image/png'));
          }
        };
      } else {
        resolve(canvas.toDataURL('image/png'));
      }
    });
  }

  createPhoto() {
    if (!this.form.valid) {
      return;
    }

    let imgBase64 = this.imgBase64.replace(
      /^data:image\/(png|jpg);base64,/,
      ''
    );
    console.log('🐱‍👤 : imgBase64', imgBase64);

    this.dowloadSinglePhoto(imgBase64);

    this.mediaService
      .addPhoto(
        imgBase64,
        this.idPhoto,
        `img${this.idPhoto}`,
        this.form.value.nomeElemento,
        this.form.value.note,
        this.date,
        this.user.idutente,
        this.room.id,
        this.room.usermobile,
        this.room.progetto,
        this.coordinates ? this.coordinates.latitude : null,
        this.coordinates ? this.coordinates.longitude : null
      )
      .subscribe(
        /** Il server risponde con 200 */
        (res) => {
          console.log('🐱‍👤 : res', res);
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss({ message: 'Foto Salvata' }, 'ok');
          }
          // possibili errori
          else {
            this.form.reset();
            this.modalController.dismiss({ message: res['message'] }, 'error');
          }
        },
        /** Il server risponde con un errore */
        (err) => {
          console.log('🐱‍👤 : err', err);
          this.form.reset();
          this.modalController.dismiss({ message: err.error['text'] }, 'error');
        }
      );
  }

  dowloadSinglePhoto(imageBase64: string) {
    const link = document.createElement('a');
    link.setAttribute('href', `data:image/jpeg;base64,${imageBase64}`);
    link.setAttribute(
      'download',
      `${
        this.form.value.nomeElemento
          ? this.form.value.nomeElemento
          : `img${this.idPhoto}`
      }.jpeg`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  clearCanvasBoard() {
    this.isBoardVisible = !this.isBoardVisible;
    setTimeout(() => {
      this.boardPaint.initBoard();
      this.isBoardVisible = !this.isBoardVisible;
    }, 50);
  }
  openBoard() {
    this.isBoardVisible = !this.isBoardVisible;
    setTimeout(() => {
      this.boardPaint.initBoard();
    }, 100);
  }
  isBoardVisibleApply() {
    let data = this.boardPaint.exportCanvasImagePainted();

    this.drawImageToCanvas(this.imgBase64, data).then((imgBase64) => {
      this.imgBase64 = imgBase64;
    });
    setTimeout(() => {
      this.isBoardVisible = !this.isBoardVisible;
    }, 100);
  }
}
