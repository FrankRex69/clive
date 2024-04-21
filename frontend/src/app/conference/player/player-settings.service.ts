import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

export interface Device{
  label: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerSettingsService {

  constructor(
    private socket: Socket,
  ) { }
  
  selectedVideoInput: Device;
  selectedAudioInput: Device;
  selectedAudioOutput: Device;

  private audioOutputSubj = new BehaviorSubject<Device>(null);
  audioOutput$ = this.audioOutputSubj.asObservable();
  
  videoInputs: Device[] = [];
  audioInputs: Device[] = [];
  audioOutputs: Device[] = [];

  async initPlayerSettings(){
    await this.refreshDevices();
    this.selectDefaults();
  }

  async refreshDevices(){
    this.videoInputs= [];
    this.audioInputs= [];
    this.audioOutputs= [];

    // x TEST errori
    // this.audioOutputs.push({
    //   id: '0123',
    //   label: 'pino'
    // });
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
      return;
    }
    await navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        // Iterate over all the list of devices (InputDeviceInfo and MediaDeviceInfo)
        devices.forEach((device) => {          
          this.socket.emit('kind', {kind: device.kind})
          
          // According to the type of media device
          switch(device.kind){
            case "videoinput":
              this.videoInputs.push({
                label: device.label || `Camera ${this.videoInputs.length + 1}`,
                id: device.deviceId,
              });
              break;
            case "audioinput":
              this.audioInputs.push({
                label: device.label || `Microphone ${this.audioInputs.length + 1}`,
                id: device.deviceId,
              });
              break;
            case "audiooutput":
              this.audioOutputs.push({
                label: device.label || `Output ${this.audioOutputs.length + 1}`,
                id: device.deviceId,
              });
              break;
          }                
        });
        if(this.audioOutputs.length <= 0){
          this.audioOutputs = [{
            label: 'Predefinito',
            id: 'default'
          }]
        }
      })
      .catch((err) => {
        console.log(err.name + ': ' + err.message);
      });
  }

  selectDefaults(){
    this.selectDefaultVideoInput();
    this.selectDefaultAudioInput();
    this.selectDefaultAudioOutput();
    this.audioOutputSubj.next(this.selectedAudioOutput);
  }

  selectDefaultVideoInput(){
    this.videoInputs.forEach((device: Device) => { 
      
      if (       
        device.label.indexOf('facing back') > 0 ||
        /Samsung|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {        
        this.selectedVideoInput = device;
      } else {        
        this.selectedVideoInput = this.videoInputs[0];
      }
    });
  }

  selectDefaultAudioInput(){
    this.selectedAudioInput = this.audioInputs[0];
  }

  selectDefaultAudioOutput(){
    this.selectedAudioOutput = this.audioOutputs[0];
  }

  updateSettings(selectedVideoInputId: string, selectedAudioInputId: string, selectedAudioOutputId: string){
    this.selectedVideoInput = this.videoInputs.find((videoInput: Device) =>{
      return videoInput.id.includes(selectedVideoInputId);
    });
    this.selectedAudioInput = this.audioInputs.find((audioInput: Device) =>{
      return audioInput.id.includes(selectedAudioInputId);
    });
    this.selectedAudioOutput = this.audioOutputs.find((audioOutput: Device) =>{
      return audioOutput.id.includes(selectedAudioOutputId);
    });
    this.audioOutputSubj.next(this.selectedAudioOutput);
  }
}
