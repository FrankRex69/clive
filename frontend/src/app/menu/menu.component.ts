import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

import { AuthUser } from '../auth/auth-user.model';
import { AudioRTCService } from '../conference/audio-rtc.service';
import { StreamingRtmpService } from '../conference/streaming-rtmp.service';
import { Room, RoomService } from '../rooms/room.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  public currentUser: AuthUser;
  public currentRoom: Room;

  constructor(
    public authService: AuthService,
    public roomService: RoomService,
    private streamService: StreamingRtmpService,
    public audioService: AudioRTCService,
    public socket: Socket
  ) {}

  refreshMenu() {
    combineLatest([this.authService.currentUser$, this.roomService.currentRoom$])
      .pipe(take(1))
      .subscribe(([user, room]) => {
        this.currentUser = user;
        this.currentRoom = room;
      });
  }

  onLogout() {
    if (this.currentRoom) {
      this.streamService.leaveStreaming(this.currentRoom.id);
      this.audioService.leaveRoom(this.currentRoom.id.toString());
    }
    this.authService.logout();
    this.socket.disconnect();
    setTimeout(() => {
      this.socket.connect();
    }, 1000);
  }
}
