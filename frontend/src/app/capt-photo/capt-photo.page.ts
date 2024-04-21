import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-capt-photo',
  templateUrl: './capt-photo.page.html',
  styleUrls: ['./capt-photo.page.scss'],
})
export class CaptPhotoPage implements AfterViewInit {
  constructor() {}

  WIDTH = 640;
  HEIGHT = 480;

  @ViewChild('video')
  public video: ElementRef;

  @ViewChild('canvas')
  public canvas: ElementRef;

  captures: string[] = [];
  error: any;
  // isCaptured: boolean;

  async ngAfterViewInit() {
    await this.setupDevices();
  }
  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          // this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = 'You have no output video device';
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    let dataURL = this.canvas.nativeElement.toDataURL('image/png');
    //RESTITUISCE --> data:image/png;base64,<imgBase64>
    this.captures.push(dataURL);
  }

  setPhoto(idx: number) {
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }
}
