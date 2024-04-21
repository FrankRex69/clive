import { Component, Input } from '@angular/core';
import { Room } from 'src/app/rooms/room.service';

import { RoomFunctionsService } from '../room-functions.service';

@Component({
  selector: 'app-room-item-mobile',
  templateUrl: './room-item-mobile.component.html',
})
export class RoomsItemMobileComponent {
  @Input() room: Room;

  constructor(public roomFunctions: RoomFunctionsService) {}
}
