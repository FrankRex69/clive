import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  IonItemSliding,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { CreateCommissionModalComponent } from './create-commission-modal/create-commission-modal.component';
import { EditCommissionModalComponent } from './edit-commission-modal/edit-commission-modal.component';
import { Commission, CommissionService } from './commission.service';

@Component({
  selector: 'app-generic-commission-item',
  template: ``,
})
export class GenericCommissionItemComponent implements OnInit {
  @Input() commission: Commission;

  constructor(
    public router: Router,
    public commissionService: CommissionService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  doRefresh(event) {
    this.commissionService.loadCommissions().subscribe((res) => {
      event.target.complete();
    });
  }

  createCommission() {
    this.modalController
      .create({
        component: CreateCommissionModalComponent,
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

  editCommission(commission?: Commission, slidingItem?: IonItemSliding) {
    if (slidingItem) {
      slidingItem.close();
    }
    if (commission) {
      this.commission = commission;
    }

    this.modalController
      .create({
        component: EditCommissionModalComponent,
        componentProps: { commissionId: this.commission.id },
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

  deleteCommission(commission?: Commission, slidingItem?: IonItemSliding) {
    if (slidingItem) {
      slidingItem.close();
    }
    if (commission) {
      this.commission = commission;
    }

    this.alertController
      .create({
        header: 'Sei sicuro?',
        message: 'Vuoi davvero cancellare la commessa?',
        buttons: [
          { text: 'Annulla', role: 'cancel' },
          {
            text: 'Elimina',
            handler: () =>
              this.commissionService
                .deleteCommission(this.commission.id)
                .subscribe((res) =>
                  this.presentToast('Commessa Eliminata', 'secondary')
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
