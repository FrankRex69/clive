import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AlertService } from '../shared/alert.service';
import { PlayerSettingsService } from './player/player-settings.service';

declare let WebRTCAdaptor: any;

export interface Listener {
  id: string;
  micOn?: boolean;
  stream?: MediaStream;
}

@Injectable({
  providedIn: 'root',
})
export class AudioRTCService {
  constructor(
    private playerSettings: PlayerSettingsService,
    private alertService: AlertService
  ) {}

  private webRTCInstance: any;
  private websocketURL = 'wss://www.eaglelive.tv:/WebRTCAppEE/websocket';
  private token: string = '';
  private pc_config = null;
  // private pc_config = {
  //   iceServers: [{urls: 'stun:stun1.l.google.com:19302'}],
  // };
  private sdpConstraints = {
    OfferToReceiveAudio: false,
    // OfferToReceiveVideo: false,
  };
  // private mediaConstraints = {
  //   // video: true,
  //   audio: true,
  // };

  public isDataChannelOpen: boolean = false;
  public isMicOn: boolean = false;
  public isJoined: boolean = false;

  public toggleMic(streamId: string) {
    if (this.webRTCInstance) {
      if (!this.isMicOn) {
        this.webRTCInstance.unmuteLocalMic();
        this.isMicOn = true;
        this.updateListener(this.isMicOn, streamId);
        this.sendNotificationEvent(this.isMicOn, streamId);
      } else {
        this.webRTCInstance.muteLocalMic();
        this.isMicOn = false;
        this.updateListener(this.isMicOn, streamId);
        this.sendNotificationEvent(this.isMicOn, streamId);
      }
    }
  }

  public toggleAudio(roomId: string, streamId: string) {
    if (!this.isJoined) {
      this.joinRoom(roomId, streamId);
    } else {
      this.leaveRoom(roomId);
    }
  }

  public joinRoom(roomId: string, streamId: string) {
    !this.webRTCInstance
      ? this.createWebRTCInstance(roomId, streamId)
      : this.webRTCInstance.joinRoom(roomId, streamId);
  }

  public leaveRoom(roomId: string) {
    if (this.isJoined) {
      if (this.webRTCInstance) {
        this.webRTCInstance.leaveFromRoom(roomId);
      }
    }
  }

  switchAudioInputSource(streamId: string) {
    if (this.isJoined) {
      this.webRTCInstance.switchAudioInputSource(
        streamId,
        this.playerSettings.selectedAudioInput.id
      );
    }
  }

  addListener(listenerId: string, streamData?: MediaStream, muted?: boolean) {
    console.log('💩kkkkkkkkkkkkkkkkkkkk', muted);

    let listeners = this.listenersSubject.getValue();
    const newListener = {
      id: listenerId,
      micOn: muted ? muted : undefined,
      stream: streamData ? streamData : null,
    };
    // console.log('🐱‍👤 : listeners', listeners);
    console.log('🐱‍👤 : newListener', newListener);
    if (!listeners.find((listener) => listener.id === listenerId)) {
      let updatedListeners: Listener[] = [...listeners];
      updatedListeners.push(newListener);
      this.listenersSubject.next(updatedListeners);
    }
  }

  updateListener(isMicOn: boolean, listenerId: string) {
    let listeners = this.listenersSubject.getValue();
    listeners.find((listener) => {
      if (listener.id === listenerId) {
        listener.micOn = isMicOn;
      }
    });

    let updatedListeners: Listener[] = [...listeners];

    this.listenersSubject.next(updatedListeners);
  }

  removeListener(listenerId: string) {
    let listeners = this.listenersSubject.getValue();
    // console.log('🐱‍👤 : listeners', listeners);
    // console.log('🐱‍👤 : listenerId', listenerId);
    if (!!listeners.find((listener) => listener.id === listenerId)) {
      let updatedListeners: Listener[] = [...listeners].filter(
        (listener) => listener.id !== listenerId
      );
      this.listenersSubject.next(updatedListeners);
    }
  }

  private listenersSubject = new BehaviorSubject<Listener[]>([]);
  listeners$ = this.listenersSubject.asObservable();

  createWebRTCInstance(roomId: string, streamId: string): void {
    if (this.webRTCInstance) {
      return;
    }

    let mediaConstraints = {
      audio: {
        deviceId: this.playerSettings.selectedAudioInput.id
          ? { exact: this.playerSettings.selectedAudioInput.id }
          : undefined,
      },
    };
    console.log('🐱‍👤 : mediaConstraints', mediaConstraints);

    this.webRTCInstance = new WebRTCAdaptor({
      websocket_url: this.websocketURL,
      mediaConstraints: mediaConstraints,
      peerconnection_config: this.pc_config,
      sdp_constraints: this.sdpConstraints,
      // localVideoId: 'localAudio',
      // remoteVideoId: 'remoteAudio',
      // isPlayMode: this.playOnly,
      debug: true,
      callback: (info, data) => {
        // console.log('🐱‍👤 : info', info, data);
        if (info == 'initialized') {
          console.log('🐱‍👤 : initialized');
          this.webRTCInstance.joinRoom(roomId, streamId);
        } else if (info == 'joinedTheRoom') {
          console.log('🐱‍👤 : joinedTheRoom', data);
          this.webRTCInstance.publish(data.streamId, this.token);
          // this.publish(data.streamId, this.token);
          if (data.streams.length) {
            data.streams.forEach((streamId) => {
              // console.log('🐱‍👤 : item', streamId);
              // this.userJoined.next(item);
              // this.addListener(streamId);
              this.webRTCInstance.play(streamId, this.token, roomId);
            });
          }
        } else if (info == 'leavedFromRoom') {
          // console.log('🐱‍👤 : leavedFromRoom', data);
          // this.userLeaved.next(this.streamId);
        } else if (info == 'streamJoined') {
          // console.log('🐱‍👤 : streamJoined', data);
          this.webRTCInstance.play(data.streamId, this.token, roomId);
        } else if (info == 'newStreamAvailable') {
          console.log('🐱‍👤 : newStreamAvailable', data);
          // this.addRemoteVideo(obj);
          // this.userJoined.next(obj.streamId);
          this.addListener(data.streamId, data.stream, data.track.enabled);
        } else if (info == 'streamLeaved') {
          console.log('🐱‍👤 : streamLeaved', data);
          // this.removeRemoteVideo(obj.streamId);
          // this.userLeaved.next(obj.streamId);
          this.removeListener(data.streamId);
        } else if (info == 'publish_started') {
          console.log('🐱‍👤 : publish_started', data);
          this.isJoined = true;
          this.webRTCInstance.muteLocalMic();
          this.isMicOn = false;
          // this.userJoined.next(obj.streamId);
          this.addListener(data.streamId);
        } else if (info == 'publish_finished') {
          console.log('🐱‍👤 : publish_finished', data);
          this.listenersSubject.next([]);
          this.isJoined = false;
          if (this.isMicOn) {
            this.webRTCInstance.muteLocalMic();
            this.isMicOn = false;
          }
        } else if (info == 'closed') {
          console.log('🐱‍👤 : closed', data);
          this.listenersSubject.next([]);
          this.isJoined = false;
          this.webRTCInstance = null;
          // if (typeof obj != 'undefined') {
          //   console.log('Connecton closed: ' + JSON.stringify(obj));
          // }
        } /*  else if (info == 'play_finished') {
          console.log('play_finished');
        } */ /* else if (info == 'streamInformation') {
          console.log('🐱‍👤 : streamInformation', obj);
          this.streamInformation(obj, roomId);
        } */ else if (info == 'data_channel_opened') {
          console.log('Data Channel open for stream id', data);
          this.isDataChannelOpen = true;
        } else if (info == 'data_channel_closed') {
          console.log('Data Channel closed for stream id', data);
          this.isDataChannelOpen = false;
        } else if (info == 'data_received') {
          console.log('🐱‍👤 : data_received', data);
          this.handleNotificationEvent(data);
        }
      },
      callbackError: (error, message) => {
        //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError
        var errorId;
        console.log('error callback: ', JSON.stringify(error));
        var errorMessage = JSON.stringify(error);
        if (typeof message != 'undefined') {
          errorMessage = message;
          errorId = '0';
        }
        var errorMessage = JSON.stringify(error);
        if (error.indexOf('NotFoundError') != -1) {
          errorMessage =
            'Camera or Mic are not found or not allowed in your device.';
          errorId = '1';
        } else if (
          error.indexOf('NotReadableError') != -1 ||
          error.indexOf('TrackStartError') != -1
        ) {
          errorMessage =
            'Camera or Mic is being used by some other process that does not not allow these devices to be read.';
          errorId = '2';
        } else if (
          error.indexOf('OverconstrainedError') != -1 ||
          error.indexOf('ConstraintNotSatisfiedError') != -1
        ) {
          errorMessage =
            'There is no device found that fits your video and audio constraints. You may change video and audio constraints.';
          errorId = '3';
        } else if (
          error.indexOf('NotAllowedError') != -1 ||
          error.indexOf('PermissionDeniedError') != -1
        ) {
          errorMessage = 'You are not allowed to access camera and mic.';
          errorId = '4';
        } else if (error.indexOf('TypeError') != -1) {
          errorMessage = 'Video/Audio is required.';
          errorId = '5';
        } else if (error.indexOf('UnsecureContext') != -1) {
          errorMessage =
            'Fatal Error: Browser cannot access camera and mic because of unsecure context. Please install SSL and access via https';
          errorId = '6';
        } else if (error.indexOf('WebSocketNotSupported') != -1) {
          errorMessage = 'Fatal Error: WebSocket not supported in this browser';
          errorId = '7';
        } else if (error.indexOf('no_stream_exist') != -1) {
          //TODO: removeRemoteVideo(error.streamId);
          errorId = '8';
        } else if (error.indexOf('data_channel_error') != -1) {
          errorMessage = 'There was a error during data channel communication';
          errorId = '9';
        } else if (error.indexOf('already_publishing') != -1) {
          errorMessage = errorMessage;
          errorId = '10';
        } else if (error.indexOf('already_playing') != -1) {
          errorMessage = errorMessage;
          errorId = '11';
        } else if (error.indexOf('streamIdInUse') != -1) {
          errorMessage = errorMessage;
          errorId = '12';
        }
        this.alertService.presentBasicAlert('Error', errorMessage, ['OK']);
      },
    });
  }

  handleNotificationEvent(obj) {
    console.log('Received data ***********: ', obj.event.data);
    var notificationEvent = JSON.parse(obj.event.data);
    if (notificationEvent != null && typeof notificationEvent == 'object') {
      var eventStreamId = notificationEvent.streamId;
      var eventTyp = notificationEvent.eventType;

      if (eventTyp == 'MIC_MUTED') {
        console.log('Microphone muted for : ', eventStreamId);
        this.updateListener(false, eventStreamId);
      } else if (eventTyp == 'MIC_UNMUTED') {
        console.log('Microphone unmuted for : ', eventStreamId);
        this.updateListener(true, eventStreamId);
      }
    }
  }

  sendNotificationEvent(isMicOn: boolean, streamId: string) {
    if (this.isDataChannelOpen) {
      let notEvent = {
        streamId: streamId,
        eventType: isMicOn ? 'MIC_UNMUTED' : 'MIC_MUTED',
      };
      this.webRTCInstance.sendData(streamId, JSON.stringify(notEvent));
    } else {
      console.log(
        'Could not send the notification because data channel is not open.'
      );
    }
  }

  // TODO: implementarlo su conference page?
  // ngOnDestroy(): void {
  //   this.leaveRoom();
  // }
}
