import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestGpsPageRoutingModule } from './test-gps-routing.module';

import { TestGpsPage } from './test-gps.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TestGpsPageRoutingModule],
  declarations: [TestGpsPage],
})
export class TestGpsPageModule {}
