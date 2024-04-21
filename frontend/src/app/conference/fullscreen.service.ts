import { Injectable } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Platform } from '@ionic/angular';
import { fromEvent, merge } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FullscreenService {
  private doc = <FullScreenDocument>document;

  fullscreenchange$ = fromEvent(this.doc, 'fullscreenchange');
  webkitfullscreenchange$ = fromEvent(this.doc, 'webkitfullscreenchange');
  mozfullscreenchange$ = fromEvent(this.doc, 'mozfullscreenchange');
  MSFullscreenChange$ = fromEvent(this.doc, 'MSFullscreenChange');

  public fullscreenEvents$ = merge(
    this.fullscreenchange$,
    this.webkitfullscreenchange$,
    this.mozfullscreenchange$,
    this.MSFullscreenChange$
  );

  constructor(
    private screenOrientation: ScreenOrientation,
    private platform: Platform
  ) {
    this.fullscreenEvents$.subscribe(() => {
      if (this.isEnabled) {
        if (this.platform.is('capacitor') || this.platform.is('cordova')) {
          this.screenOrientation.unlock();
        }
      } else {
        if (this.platform.is('capacitor') || this.platform.is('cordova')) {
          this.screenOrientation.lock(
            this.screenOrientation.ORIENTATIONS.PORTRAIT
          );
        }
      }
    });
  }

  enter() {
    const el = this.doc.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }

  leave() {
    if (this.doc.exitFullscreen) this.doc.exitFullscreen();
    else if (this.doc.msExitFullscreen) this.doc.msExitFullscreen();
    else if (this.doc.mozCancelFullScreen) this.doc.mozCancelFullScreen();
    else if (this.doc.webkitExitFullscreen) this.doc.webkitExitFullscreen();
  }

  toggle() {
    if (this.isEnabled) this.leave();
    else this.enter();
  }

  get isEnabled() {
    return !!(
      this.doc.fullscreenElement ||
      this.doc.mozFullScreenElement ||
      this.doc.webkitFullscreenElement ||
      this.doc.msFullscreenElement
    );
  }
}

interface FullScreenDocument extends Document {
  documentElement: FullScreenDocumentElement;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
}

interface FullScreenDocumentElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}
