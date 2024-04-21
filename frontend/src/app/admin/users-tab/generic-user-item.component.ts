import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  IonItemSliding,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { User, UserService } from 'src/app/admin/users-tab/user.service';
import { CreateUserModalComponent } from './create-user-modal/create-user-modal.component';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-generic-user-item',
  template: ``,
})
export class GenericUserItemComponent implements OnInit {
  @Input() user: User;

  constructor(
    public router: Router,
    public userService: UserService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  doRefresh(event) {
    this.userService.loadUsers().subscribe((res) => {
      event.target.complete();
    });
  }

  createUser() {
    this.modalController
      .create({
        component: CreateUserModalComponent,
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

  editUser(user?: User, slidingItem?: IonItemSliding) {
    if (slidingItem) {
      slidingItem.close();
    }
    if (user) {
      this.user = user;
    }

    this.modalController
      .create({
        component: EditUserModalComponent,
        componentProps: { userId: this.user.id },
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

  deleteUser(user?: User, slidingItem?: IonItemSliding) {
    if (slidingItem) {
      slidingItem.close();
    }
    if (user) {
      this.user = user;
    }

    this.alertController
      .create({
        header: 'Sei sicuro?',
        message: "Vuoi davvero cancellare l'Utente?",
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Elimina',
            handler: () =>
              this.userService
                .deleteUser(this.user.id)
                .subscribe((res) =>
                  this.presentToast('Utente Eliminato', 'secondary')
                ),
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  async presentToast(message: string, color?: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color ? color : 'secondary',
      duration: duration ? duration : 2000,
      cssClass: 'custom-toast',
    });
    // .then(toastEl => toastEl.present());
    toast.present();
  }
}
