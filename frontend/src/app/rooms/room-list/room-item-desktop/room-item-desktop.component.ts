import { Component, Input } from '@angular/core';
import { Room } from 'src/app/rooms/room.service';

import { RoomFunctionsService } from '../room-functions.service';

@Component({
  selector: 'app-room-item-desktop',
  templateUrl: './room-item-desktop.component.html',
  styleUrls: ['../../../shared/generic-table/generic-table.component.scss'],
})
export class RoomsItemDesktopComponent {
  @Input() columns;
  @Input() room: Room;

  constructor(public roomFunctions: RoomFunctionsService) {}
}
