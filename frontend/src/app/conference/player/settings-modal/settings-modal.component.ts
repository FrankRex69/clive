import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { PlayerSettingsService } from '../player-settings.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {

  selectedVideoInputId: string; 
  selectedAudioInputId: string; 
  selectedAudioOutputId: string;
  
  constructor(
    private modalController: ModalController, 
    public playerSettings: PlayerSettingsService
    ) { }

  isLoading = false;
  ngOnInit() {
    this.isLoading = true;
    this.playerSettings.refreshDevices().then(()=>{
      this.selectedVideoInputId = this.playerSettings.selectedVideoInput.id;
      this.selectedAudioInputId = this.playerSettings.selectedAudioInput.id;
      this.selectedAudioOutputId = this.playerSettings.selectedAudioOutput.id;
      this.isLoading = false;
    });
  }

  resetVideoInput(){
    this.playerSettings.selectDefaultVideoInput();
    this.selectedVideoInputId = this.playerSettings.selectedVideoInput.id;
  }

  resetAudioInput(){
    this.playerSettings.selectDefaultAudioInput();
    this.selectedAudioInputId = this.playerSettings.selectedAudioInput.id;
  }

  resetAudioOutput(){
    this.playerSettings.selectDefaultAudioOutput();
    this.selectedAudioOutputId = this.playerSettings.selectedAudioOutput.id;
  }

  updateSettings() {
    this.playerSettings.updateSettings(this.selectedVideoInputId, this.selectedAudioInputId, this.selectedAudioOutputId)
    this.modalController.dismiss(
      { message: 'Impostazioni Aggiornate' },
      'ok'
    );
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }

}
