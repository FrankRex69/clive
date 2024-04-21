import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

import { CreateRoomModalComponent } from '../create-room-modal/create-room-modal.component';
import { EditRoomModalComponent } from '../edit-room-modal/edit-room-modal.component';
import { Room, RoomService } from '../room.service';

@Injectable({
  providedIn: 'root',
})
export class RoomFunctionsService {
  // baseUrl =
  //   'https://www.collaudolive.com:9777/glasses/FrontEnd/src/index.php?q=';

  constructor(
    private platform: Platform,
    public router: Router,
    public navController: NavController,
    public roomService: RoomService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {}

  doRefresh(event) {
    this.roomService.loadRooms().subscribe((res) => {
      event.target.complete();
    });
  }

  openMedia(id: number, proj: string) {
    this.router.navigate([`/gallery/${id}/${proj}`]);
  }

  /** Apre il modale di CREAZIONE ROOM */
  createRoom() {
    this.modalController
      .create({
        component: CreateRoomModalComponent,
        backdropDismiss: false,
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((res) => {
        if (res.role === 'ok') {
          this.presentToast(res.data['message'], 'secondary');
        } else if (res.role === 'error') {
          this.presentToast(
            `Aggiornamento fallito.\n ${res.data['message']}`,
            'danger',
            5000
          );
        }
      });
  }

  /** Apre il modale di MODIFICA ROOM */
  editRoom(room: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    // if (room) this.room = room;

    this.modalController
      .create({
        component: EditRoomModalComponent,
        backdropDismiss: false,
        componentProps: { roomId: room.id },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((res) => {
        if (res.role === 'ok') {
          this.presentToast(res.data['message'], 'secondary');
        } else if (res.role === 'error') {
          this.presentToast(
            `Aggiornamento fallito.\n${res.data['message']}`,
            'danger',
            5000
          );
        }
      });
  }

  /** Crea un alert per la cancellazione della ROOM */
  deleteRoom(room: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    // if (room) this.room = room;

    this.alertController
      .create({
        header: 'Sei sicuro?',
        message: 'Vuoi davvero cancellare il progetto?',
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Elimina',
            handler: () =>
              this.roomService
                .deleteRoom(room.id)
                .subscribe((res) =>
                  this.presentToast('Room Eliminata', 'secondary')
                ),
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  /** Entra nella ROOM */
  enterRoom(room: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    // if (room) this.room = room;

    // * parametro sulla Url
    // * funziona tutto correttamente
    // * posso anche aprire due schede con due room diverse
    // ! MA
    // ! i dati sulla url possono essere modificati
    // ! se li modifico e la room non esite non la carica > error 404
    // ! se li modifico e la room esite vanno gestite le autorizzazioni
    // ? criptare il numero della room (codice meno evidente) ?
    // ? https://www.npmjs.com/package/uuid ?

    if (this.platform.is('mobile')) {
      this.router.navigate([`/conference/${room.id}`]);
    } else {
      let arr = window.location.href.split('/');
      let baseUrl = arr[0] + '//' + arr[2];
      let url = `${baseUrl}/conference/${room.id}`;
      window.open(url, '_blank').focus();
    }

  }

  /** Copia il link della ROOM */
  copyLink(room: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    // if (room) this.room = room;

    const params = new URLSearchParams({
      // roomId: encodeURIComponent(this.room.id),
      session: encodeURIComponent(room.sessione),
      project: encodeURIComponent(room.progetto),
      creator: encodeURIComponent(room.collaudatore),
    });

    let arr = window.location.href.split('/');
    let baseUrl = arr[0] + '//' + arr[2];
    let url = `${baseUrl}/conference/${room.id}?${params}`;

    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData(
        'text/plain',
        url
      );
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');

    if (this.platform.is('mobile')) {
      const shareData = {
        title: 'SmartCollaudo',
        text: 'Comune di ' + room.progetto,
        url: url,
      };
      navigator.share(shareData);
    } else{
      this.presentToast('Link copiato.', 'secondary');
    }
  }

  /** Avvia il download delle foto della ROOM */
  downloadFoto(room: Room, slidingItem?: IonItemSliding) {
    if (slidingItem) slidingItem.close();
    // if (room) this.room = room;

    const nomeProgetto = room.progetto.trim().replace(' ', '');
    this.roomService.checkDownload(nomeProgetto).subscribe((value: boolean) => {
      if (value) {
        const link = document.createElement('a');
        //link.setAttribute('target', '_blank');
        //link.setAttribute('href', `https://www.collaudolive.com:9083/downloadzip/${nomeProgetto}`);
        link.setAttribute(
          'href',
          `${environment.apiUrl}/downloadzip/${nomeProgetto}`
        );
        link.setAttribute('download', `${nomeProgetto}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        this.presentToast(
          `Non ci sono foto sul progetto ${nomeProgetto}!`,
          'danger'
        );
      }
    });
  }

  async presentToast(message: string, color?: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color ? color : 'secondary',
      duration: duration ? duration : 2000,
      cssClass: 'custom-toast',
    });
    toast.present();
  }
}
