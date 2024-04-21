import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';
import { GuestLoginComponent } from './guest-login/guest-login.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { NgParticlesModule } from 'ng-particles';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    AuthPageRoutingModule,
    NgParticlesModule,
  ],
  declarations: [AuthPage, UserLoginComponent, GuestLoginComponent],
})
export class AuthPageModule {}
