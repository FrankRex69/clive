import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { ViewWillEnter } from '@ionic/angular';
import { from } from 'rxjs';
import {
  ClickMode,
  Container,
  HoverMode,
  ISourceOptions,
  MoveDirection,
  OutMode,
  ShapeType,
} from 'tsparticles';

interface RoomInfo {
  roomId: string;
  session: string;
  project: string;
  creator: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, ViewWillEnter {
  public directLink: boolean = false;
  public roomInfo: RoomInfo;
  // public roomId: string;

  id = 'tsparticles';

  particlesOptions: ISourceOptions = {
    //autoPlay: true,
    background: {
      color: {
        value: '#fff',
      },
    },
    fpsLimit: 60,
    interactivity: {
      detectsOn: 'window',
      events: {
        onClick: {
          enable: false,
          mode: ClickMode.push,
        },
        onHover: {
          enable: true,
          mode: HoverMode.bubble,
        },
        resize: true,
      },
      modes: {
        bubble: {
          distance: 200,
          duration: 1,
          opacity: 0.8,
          size: 8,
        },
        push: {
          quantity: 5,
        },
        repulse: {
          distance: 50,
          duration: 0.5,
        },
      },
    },
    particles: {
      color: {
        value: '#03477e',
      },
      links: {
        color: '#03477e',
        distance: 260,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outMode: OutMode.bounce,
        random: true,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          value_area: 400,
        },
        value: 20,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: ShapeType.circle,
      },
      size: {
        random: true,
        value: 1,
      },
    },
    detectRetina: true,
  };

  constructor() {}

  ionViewWillEnter() {
    // Storage.remove({ key: 'authData' });
  }

  ngOnInit() {
    from(Storage.get({ key: 'roomData' })).subscribe((storedData) => {
      if (!storedData || !storedData.value) {
        this.directLink = false;
        return null;
      }
      this.directLink = true;
      const parsedData = JSON.parse(storedData.value);
      this.roomInfo = {
        roomId: parsedData.roomId,
        session: parsedData.session,
        project: parsedData.project,
        creator: parsedData.creator,
      };
    });
    window.dispatchEvent(new Event('resize'));
  }
  public particlesLoaded(container: Container): void {
    setTimeout(async () => {
      container.refresh();
    }, 500);
  }
}
