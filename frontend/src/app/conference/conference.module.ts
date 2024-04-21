import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { BoardComponent } from './board/board.component';
import { ChatComponent } from './chat/chat.component';
import { ConferencePageRoutingModule } from './conference-routing.module';
import { ConferencePage } from './conference.page';
import { MapComponent } from './map/map.component';
import { PhotoModalComponent } from './photo-modal/photo-modal.component';
import { PlayerBarComponent } from './player/player-bar/player-bar.component';
import { PlayerComponent } from './player/player.component';
import { SettingsModalComponent } from './player/settings-modal/settings-modal.component';
import { SharedBoardComponent } from './shared-board/shared-board.component';
import { UsersListComponent } from './users-list/users-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ConferencePageRoutingModule,
    SharedModule,
  ],
  declarations: [
    ConferencePage,
    PlayerComponent,
    PlayerBarComponent,
    UsersListComponent,
    MapComponent,
    PhotoModalComponent,
    ChatComponent,
    SharedBoardComponent,
    BoardComponent,
    SettingsModalComponent,
  ],
  providers: [ScreenOrientation],
})
export class ConferencePageModule {}
