import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  @Input() roomId: string;

  loginForm: FormGroup = this.fb.group({
    username: ['', { validators: [Validators.required] }],
    password: ['', { validators: [Validators.required] }],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  showPassword: boolean;
  formSubmitted: boolean = false;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  authenticate() {
    this.formSubmitted = true;
    if (!this.loginForm.valid) {
      return;
    }

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in..' })
      .then((loadingEl) => {
        loadingEl.present();
        // let authObs: Observable<any>;
        // if (this.isLogin) {
        //   authObs = this.authService.login(this.form.value.username, this.form.value.password);
        // } else {
        //   authObs = this.authService.signup(this.form.value.username, this.form.value.password);
        // }
        this.authService
          .login(this.loginForm.value.username, this.loginForm.value.password)
          .subscribe(
            (res) => {
              this.loginForm.reset();
              loadingEl.dismiss();
              if (this.roomId) {
                this.router
                  .navigate([`/conference/${this.roomId}`])
                  .then((res) => Storage.remove({ key: 'roomData' }));
              } else {
                this.router.navigateByUrl('/rooms');
              }
            },
            (err) => {
              console.log('🐱‍👤 : LoginComponent : err', err);
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
