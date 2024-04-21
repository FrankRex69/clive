import { Component, Input, OnInit } from '@angular/core';
import { AuthUser } from 'src/app/auth/auth-user.model';

import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  constructor(public chatService: ChatService) {}

  @Input() roomId: number;
  @Input() user: AuthUser;

  myTextMessage: string;

  ngOnInit() {
    this.chatService.init(this.roomId);
  }

  sendMsg() {
    if (this.myTextMessage) {
      this.chatService.emitMessage(this.roomId,this.user.nomecognome,this.myTextMessage);
      this.myTextMessage = '';
    }
  }

  onKeydown(event: Event): void {
    event.preventDefault();
  }
}
