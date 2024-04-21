import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaptPhotoPageRoutingModule } from './capt-photo-routing.module';

import { CaptPhotoPage } from './capt-photo.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CaptPhotoPageRoutingModule],
  declarations: [CaptPhotoPage],
})
export class CaptPhotoPageModule {}
