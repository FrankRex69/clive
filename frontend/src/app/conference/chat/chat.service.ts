import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/toast.service';

import { FullscreenService } from '../fullscreen.service';

export interface ChatMessage {
  messaggio: string,
  nominativo: string,
  data: Date
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private socket: Socket,
    private toastService: ToastService,
    private fullscreen: FullscreenService
    ) { }

  isVisible: boolean;
  notificationCounter: number;

  private chatMessagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  chatMessages$ = this.chatMessagesSubject.asObservable();

  init(roomId: number){
    this.notificationCounter = 0;
    this.socket.fromEvent<{ messaggio: string, nominativo: string }>('chat message_' + roomId)
    .pipe(
      tap((msg: { messaggio: string, nominativo: string }) => {
        let newMessage = {
          messaggio: msg.messaggio,
          nominativo: msg.nominativo,
          data: new Date()
        }
        let updatedMessages = [...this.chatMessagesSubject.value];
        updatedMessages.push(newMessage);
        console.log('🐱‍👤 : updatedMessages', updatedMessages);
        this.chatMessagesSubject.next(updatedMessages);
        if (!this.isVisible) {
          this.notificationCounter++;
        } else {
          this.notificationCounter = 0;
        }
        if(this.fullscreen.isEnabled){
          this.toastService.presentChatMessageToast(
            newMessage.nominativo, 
            newMessage.messaggio)
        }
      }),
      debounceTime(100),
    )
    .subscribe(this.updateScroll);
  }

  emitMessage(room: number, nominativo: string, messaggio: string ){
    this.socket.emit('chat message', {
      room: room,
      nominativo: nominativo,
      messaggio: messaggio,
    });
  }

  resetNotification(){
    this.notificationCounter = 0;
  }

  updateScroll() {
    console.log('🐱‍👤 : updateScroll');
    let element = document.getElementById('msgArea');
    element.scrollTop = element.scrollHeight;
  }


}
