import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Room } from 'src/app/rooms/room.service';

import { SharedBoardService } from './shared-board.service';

@Component({
  selector: 'app-shared-board',
  templateUrl: './shared-board.component.html',
  styleUrls: ['./shared-board.component.scss'],
})
export class SharedBoardComponent implements AfterViewInit {
  @Input() room: Room;
  @ViewChild('imageCanvas', { static: false }) canvas: any;
  @ViewChild('container') container: any;

  public canvasElement: any;
  saveX: number;
  saveY: number;

  differenceBetweenCanvasX: number;
  differenceBetweenCanvasY: number;

  drawing = false;

  lineWidth = 4;

  constructor(
    private socket: Socket, 
    private plt: Platform,
    private sbService: SharedBoardService
    ) {}

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.container = this.container.nativeElement;
    this.canvasElement.width = this.container.offsetWidth;
    this.canvasElement.height = this.container.offsetHeight;

    this.socket.on('startDrawOn_' + this.room.id, (obj) => {
      let x: number;
      let y: number;

      x = this.canvasElement.width * 100;
      this.differenceBetweenCanvasX = x / obj._remoteCanvasWidth;

      y = this.canvasElement.height * 100;
      this.differenceBetweenCanvasY = y / obj._remoteCanvasHeight;

      this.differenceBetweenCanvasX.toFixed(0);
      this.differenceBetweenCanvasY.toFixed(0);

      this.saveX = (obj._saveX * this.differenceBetweenCanvasX) / 100;
      this.saveY = (obj._saveY * this.differenceBetweenCanvasY) / 100;
      this.lineWidth = obj._lineWidth;
      this.sbService.selectedColor = obj._color;
    });

    this.socket.on('movedDrawOn_' + this.room.id, (obj) => {
      let ctx = this.canvasElement.getContext('2d');

      let currentX = (obj._currentX * this.differenceBetweenCanvasX) / 100;
      let currentY = (obj._currentY * this.differenceBetweenCanvasY) / 100;

      ctx.linejoin = 'round';
      ctx.strokeStyle = this.sbService.selectedColor;
      ctx.lineWidth = this.lineWidth;

      ctx.beginPath();
      ctx.moveTo(this.saveX, this.saveY);
      ctx.lineTo(currentX, currentY);
      ctx.closePath();

      ctx.stroke();

      this.saveX = currentX;
      this.saveY = currentY;
    });
  }

  startDrawing(ev) {
    this.drawing = true;
    const canvasPosition = this.canvasElement.getBoundingClientRect();

    if (this.plt.is('mobile')) {
      this.saveX = ev.changedTouches[0].pageX - canvasPosition.x;

      this.saveY = ev.changedTouches[0].pageY - canvasPosition.y;
    } else {
      this.saveX = ev.pageX - canvasPosition.x;
      this.saveY = ev.pageY - canvasPosition.y;
    }

    this.socket.emit('startDraw', {
      _remoteCanvasWidth: this.canvasElement.width,
      _remoteCanvasHeight: this.canvasElement.height,
      _idroom: this.room.id,
      _lineWidth: this.lineWidth,
      _color: this.sbService.selectedColor,
      _saveX: this.saveX,
      _saveY: this.saveY,
    });
  }

  endDrawing(ev) {
    // console.log('end');
    this.drawing = false;
  }

  moved(ev) {
    if (!this.drawing) return;
    // console.log('qui si muove', ev);
    const canvasPosition = this.canvasElement.getBoundingClientRect();
    let ctx = this.canvasElement.getContext('2d');
    let currentX;
    let currentY;

    if (this.plt.is('mobile')) {
      currentX = ev.changedTouches[0].pageX - canvasPosition.x;
      currentY = ev.changedTouches[0].pageY - canvasPosition.y;
    } else {
      currentX = ev.pageX - canvasPosition.x;
      currentY = ev.pageY - canvasPosition.y;
    }

    ctx.linejoin = 'round';
    ctx.strokeStyle = this.sbService.selectedColor;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.socket.emit('movedDraw', {
      _idroom: this.room.id,
      _currentX: currentX,
      _currentY: currentY,
    });

    this.saveX = currentX;
    this.saveY = currentY;
  }

  public exportCanvasImage() {
    const ctx = this.canvasElement.toDataURL();
    return ctx;
  }
}
