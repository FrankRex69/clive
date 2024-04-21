import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { RoomsPageRoutingModule } from './rooms-routing.module';
import { CreateRoomModalComponent } from './create-room-modal/create-room-modal.component';
import { EditRoomModalComponent } from './edit-room-modal/edit-room-modal.component';
import { RoomsListComponent } from './room-list/room-list.component';
import { RoomsPage } from './rooms.page';
import { RoomsItemDesktopComponent } from './room-list/room-item-desktop/room-item-desktop.component';
import { RoomsItemMobileComponent } from './room-list/room-item-mobile/room-item-mobile.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RoomsPageRoutingModule,
  ],
  declarations: [
    RoomsPage,
    RoomsListComponent,
    RoomsItemDesktopComponent,
    RoomsItemMobileComponent,
    CreateRoomModalComponent,
    EditRoomModalComponent,
  ],
  entryComponents: [CreateRoomModalComponent, EditRoomModalComponent],
})
export class RoomsPageModule {}
