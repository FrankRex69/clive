import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestWebrtcPageRoutingModule } from './test-webrtc-routing.module';

import { TestWebrtcPage } from './test-webrtc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestWebrtcPageRoutingModule
  ],
  declarations: [TestWebrtcPage]
})
export class TestWebrtcPageModule {}
