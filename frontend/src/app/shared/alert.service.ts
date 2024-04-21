import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertButton } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  public alert: HTMLIonAlertElement = null;

  constructor(public alertController: AlertController) {}

  async presentAlertWithResponse(
    header: string,
    message: string,
    callback?: any
  ) {
    return new Promise(async (resolve) => {
      if (this.alert) {
        this.alert.dismiss();
        this.alert = null;
      }
      this.alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              resolve({ role: 'ok', message: 'OK' });
            },
          },
          {
            text: 'Annulla',
            handler: () => {
              resolve({ role: 'ko', message: 'Annulla' });
            },
          },
        ],
        cssClass: 'custom-alert',
      });
      if (callback) {
        callback();
      }
      this.alert.present();
    });
  }

  async presentBasicAlert(
    header: string,
    message: string,
    buttons?: (AlertButton | string)[],
    cssClass?: string,
    callback?: any
  ) {
    if (this.alert) {
      this.alert.dismiss();
      this.alert = null;
    }
    this.alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons ? buttons : ['OK'],
      cssClass: cssClass ? cssClass : 'custom-alert',
    });
    if (callback) {
      callback();
    }
    this.alert.present();
  }

  async presentWarningAlert(
    header: string,
    message: string,
    buttons?: (AlertButton | string)[]
  ) {
    if (this.alert) {
      this.alert.dismiss();
      this.alert = null;
    }
    this.alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons ? buttons : ['OK'],
      cssClass: 'warning-alert',
      backdropDismiss: false,
    });
    this.alert.present();
  }

  dismissAlert() {
    if (this.alert) {
      this.alert.dismiss();
      this.alert = null;
    }
  }

  // async createAlert(header: string, message: string) {
  //   if (this.alert) {
  //     this.alert.dismiss();
  //     this.alert = null;
  //   }
  //   this.alert = await this.alertController.create({
  //     header: header,
  //     message: message,
  //     buttons: ['OK'],
  //     cssClass: 'custom-alert',
  //   });
  //   return this.alert;
  // }
}
