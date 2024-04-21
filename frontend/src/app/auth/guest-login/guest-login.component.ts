import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-guest-login',
  templateUrl: './guest-login.component.html',
  styleUrls: ['./guest-login.component.scss'],
})
export class GuestLoginComponent implements OnInit {
  @Input() roomId: string;

  guestForm: FormGroup = this.fb.group({
    nome: ['', { validators: [Validators.required] }],
    cognome: ['', { validators: [Validators.required] }],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  formSubmitted: boolean = false;

  authenticate() {
    this.formSubmitted = true;
    if (!this.guestForm.valid) {
      return;
    }

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in..' })
      .then((loadingEl) => {
        loadingEl.present();
        this.authService
          .loginGuest(this.guestForm.value.nome, this.guestForm.value.cognome)
          .subscribe(
            (res) => {
              this.guestForm.reset();
              loadingEl.dismiss();
              this.router
                .navigate([`/conference/${this.roomId}`])
                .then((res) => Storage.remove({ key: 'roomData' }));
            },
            (err) => {
              // console.log('🐱‍👤 : LoginComponent : err', err);
              loadingEl.dismiss();
              this.showAlert(err);
            }
          );
      });
  }

  private showAlert(message: string) {
    this.alertController
      .create({
        header: 'Autenticazione fallita',
        message: message,
        buttons: ['Okay'],
      })
      .then((alertEl) => alertEl.present());
  }
}
