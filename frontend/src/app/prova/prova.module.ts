import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProvaPageRoutingModule } from './prova-routing.module';

import { ProvaPage } from './prova.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProvaPageRoutingModule],
  declarations: [ProvaPage],
})
export class ProvaPageModule {}
