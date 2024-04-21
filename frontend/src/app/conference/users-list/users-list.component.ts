import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Platform } from '@ionic/angular';
import { combineLatest, Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';
import { AudioRTCService, Listener } from 'src/app/conference/audio-rtc.service';
import { AlertService } from 'src/app/shared/alert.service';

import { FullscreenService } from '../fullscreen.service';
import { PlayerSettingsService } from '../player/player-settings.service';
import { RoomUser } from '../room-user.model';
import { StreamingRtmpService } from '../streaming-rtmp.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit, AfterViewInit, OnDestroy {
  destroy$ = new Subject();

  @ViewChildren('audio') audioTags: QueryList<ElementRef>;
  error: DOMException;

  testList = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  @Input() isListOpen: boolean;

  roomUsers$: Observable<RoomUser[]>;

  constructor(
    private playerSettings: PlayerSettingsService,
    private alertService: AlertService,
    public audioService: AudioRTCService,
    public streamService: StreamingRtmpService,
    public fullscreen: FullscreenService,
    public platform: Platform
  ) {}

  ngOnInit() {
    this.roomUsers$ = combineLatest([
      this.audioService.listeners$,
      this.streamService.watchers$,
    ]).pipe(
      tap(([listeners, watchers]) => {
        // console.log('💩 : listeners', listeners);
      }),
      map(([listeners, watchers]) => {
        let roomUsers: RoomUser[] = [];
        watchers.forEach((watcher) => {
          let listener = listeners.find(
            (listener) => listener.id === watcher.idutente
          );
          let newUser = new RoomUser(
            watcher.idutente,
            watcher.nome,
            watcher.stream,
            !!listener,
            listener ? listener.micOn : null,
            this.getAudioStream(listener)
          );
          roomUsers.push(newUser);
        });
        return roomUsers;
      }),
      debounceTime(500)
    );
  }

  // Testa se la funzione setSinkId è supportata
  supportsSetSinkId(): boolean {
    try {
      (document.createElement('audio') as any).setSinkId('default');
      return true;
    } catch (ex) {
      return false;
    }
  }

  ngAfterViewInit() {
    if (this.supportsSetSinkId()) {
      combineLatest([this.audioTags.changes, this.playerSettings.audioOutput$])
        .pipe(takeUntil(this.destroy$))
        .subscribe(async ([audioTags, audioOutput]) => {
          for (const audioTag of audioTags) {
            try {
              await audioTag.nativeElement.setSinkId(audioOutput.id);
            } catch (ex) {
              this.error = ex as DOMException;
            }
          }
          if (this.error) {
            this.alertService.presentBasicAlert(
              this.error.name,
              this.error.message,
              ['OK']
            );
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  getAudioStream(listener: Listener): MediaStream {
    if (listener) {
      return listener.stream ? listener.stream : null;
    } else {
      return null;
    }
  }
}
