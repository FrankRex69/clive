import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SharedBoardService{

  selectedColor = '#ff4733';
  colors = ['#ff4733', '#edbf4c', '#5db37e', '#4590bf', '#ffffff'];

  isBoardVisible = false;
  isBoardVisibleMyTouch = false;

  constructor(private socket: Socket) { }

  initBoard(roomId: number){

    this.socket.fromEvent<any>(`isBoard${roomId}`)
    .subscribe((res) => {
      console.log('🐱‍👤 : res', res);
      if (res.board) {
        this.isBoardVisible = true;
      }
    }, 
    (err) => {
      console.log('🐱‍👤 : err', err);
    });

    this.socket.fromEvent<any>(`isBoardClose${roomId}`)
    .subscribe(() => {
      this.isBoardVisible = false;
    });

    this.socket.fromEvent<any>(`clearBoard${roomId}`)
    .subscribe(() => {
      if (this.isBoardVisible) {
        this.isBoardVisible = !this.isBoardVisible;
        setTimeout(() => {
          this.isBoardVisible = !this.isBoardVisible;
        }, 50);
      } else {
        this.isBoardVisible = !this.isBoardVisible;
      }
    });
  }

  openBoard(roomId: number) {
    if (!this.isBoardVisibleMyTouch) {
      this.isBoardVisibleMyTouch = true;
    }

    this.isBoardVisible = !this.isBoardVisible;

    if (this.isBoardVisible) {
      console.log('🐱‍👤 : this.isBoardVisible', this.isBoardVisible);
      this.socket.emit('isBoard', {
        room: roomId,
        board: this.isBoardVisible,
      });
    }
  }

  closeBoard(roomId: number) {
    if (this.isBoardVisibleMyTouch) {
      this.isBoardVisibleMyTouch = false;
    }
    this.isBoardVisible = !this.isBoardVisible;

    /* if (this.isBoardVisible) {
      this.socket.emit('isBoardVisible', { room: this.room.id, board: this.isBoardVisible });
    } */

    this.socket.emit('isBoardClose', { room: roomId });
  }

  clearCanvasBoard(roomId: number) {
    this.isBoardVisible = !this.isBoardVisible;

    this.socket.emit('clearBoard', { room: roomId });
    setTimeout(() => {
      this.isBoardVisible = !this.isBoardVisible;
      if (this.isBoardVisible) {
        this.isBoardVisibleMyTouch = true;
      } else {
        this.isBoardVisibleMyTouch = false;
      }
    }, 50);
  }

  selectColor(color) {
    console.log('🐱‍👤 : color', color);
    this.selectedColor = color;
  }
}
