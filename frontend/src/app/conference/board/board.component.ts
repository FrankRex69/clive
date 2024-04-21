import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Platform } from '@ionic/angular';
import { Room } from 'src/app/rooms/room.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit {
  @Input() room: Room;
  @Input() imgBase64: string;
  @ViewChild('imageCanvas', { static: false }) canvas: any;
  @ViewChild('container') container: any;

  public canvasElement: any;
  saveX: number;
  saveY: number;

  differenceBetweenCanvasX: number;
  differenceBetweenCanvasY: number;

  drawing = false;

  selectedColor = '#ff4733';
  // colors = ['#ff4733'];
  lineWidth = 3;

  constructor(private plt: Platform) {}

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.container = this.container.nativeElement;
    this.canvasElement.width = this.container.offsetWidth;
    this.canvasElement.height = this.container.offsetHeight;
    // for (let i = 0; i < 5; i++) {
    //   this.colors.push('#' + (((1 << 24) * Math.random()) | 0).toString(16));
    // }
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
  }

  endDrawing(ev) {
    // console.log('end');
    this.drawing = false;
  }

  moved(ev) {
    if (!this.drawing) return;
    console.log('qui si muove', ev);
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
    ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  selectColor(color) {
    this.selectedColor = color;
  }

  initBoard() {
    let background = new Image();
    // background.src = imageBase64;
    background.onload = () => {
      var canvas = this.canvas.nativeElement;
      var context = canvas.getContext('2d');
      var hRatio = canvas.width / background.width;
      var vRatio = canvas.height / background.height;
      var ratio = Math.min(hRatio, vRatio);
      var centerShift_x = (canvas.width - background.width * ratio) / 2;
      var centerShift_y = (canvas.height - background.height * ratio) / 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        background,
        0,
        0,
        background.width,
        background.height,
        centerShift_x,
        centerShift_y,
        background.width * ratio,
        background.height * ratio
      );
    };
  }

  public exportCanvasImagePainted() {
    const image = new Image();

    let canvas = this.canvas.nativeElement;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const dataUrlP = canvas.toDataURL();
    console.log(dataUrlP);

    return dataUrlP;
  }
}
