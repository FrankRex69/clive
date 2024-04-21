import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthUser } from 'src/app/auth/auth-user.model';

import { AudioRTCService } from '../../audio-rtc.service';
import { FullscreenService } from '../../fullscreen.service';
import { GpsService } from '../../map/gps.service';
import { SharedBoardService } from '../../shared-board/shared-board.service';
import { StreamingRtmpService } from '../../streaming-rtmp.service';

@Component({
  selector: 'app-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss'],
})
export class PlayerBarComponent {
  @Input() isLandscape: boolean;
  @Input() isPip: boolean;
  @Input() user: AuthUser;
  isListOpen: boolean;

  @Output() toggleStreaming = new EventEmitter();
  @Output() toggleAudio = new EventEmitter();
  @Output() toggleMic = new EventEmitter();
  @Output() toggleGps = new EventEmitter();
  @Output() toggleFullscreen = new EventEmitter();
  @Output() generateQrCode = new EventEmitter();
  @Output() capturePhoto = new EventEmitter();
  @Output() openSettings = new EventEmitter();

  @Output() clearCanvasBoard = new EventEmitter();
  @Output() openBoard = new EventEmitter();
  @Output() closeBoard = new EventEmitter();
  @Output() selectColor = new EventEmitter<string>();

  constructor(
    public audioService: AudioRTCService,
    public streamService: StreamingRtmpService,
    public gpsService: GpsService,
    public sbService: SharedBoardService,
    public fullscreen: FullscreenService
  ) {}
}
