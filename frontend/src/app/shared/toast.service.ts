import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toast: HTMLIonToastElement = null;

  constructor(public toastController: ToastController) { }

  async presentChatMessageToast(
    header: string,
    message: string,
    /* buttons: (ToastButton | string)[], */
  ) {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
    this.toast = await this.toastController.create({
      header: header,
      message: message,
      duration: 3000,
      position: 'middle',
      cssClass: 'chat-toast',
    });
    this.toast.present();
  }

  dismissToast() {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
  }
}
