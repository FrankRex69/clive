import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { RoomValidator } from 'src/app/rooms/room.validator.service';
import { Room, RoomService } from '../room.service';

@Component({
  selector: 'app-edit-room-modal',
  templateUrl: './edit-room-modal.component.html',
  styleUrls: ['./edit-room-modal.component.scss'],
})
export class EditRoomModalComponent implements OnInit {
  form: FormGroup = this.fb.group({
    usermobile: [
      null,
      {
        validators: [Validators.required],
        // asyncValidators: null, //--> Lo aggiungo dinamicamente quando ho recuperato la room
        updateOn: 'blur',
      },
    ],
  });

  @Input() roomId: number;
  room: Room;

  ngOnInit() {
    if (this.roomId) {
      this.roomsService.getRoom(this.roomId).subscribe((room) => {
        this.room = room;
        this.form.patchValue({
          usermobile: this.room.usermobile,
        });
        this.form.controls['usermobile'].setAsyncValidators(
          this.roomValidator.usermobileValidator(this.room.usermobile)
        );
        // this.form.controls['usermobile'].updateValueAndValidity();
      });
    }
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  updateRoom() {
    if (!this.form.valid) {
      return;
    }
    this.roomsService
      .updateRoom(this.room.id, this.form.value.usermobile)
      .subscribe(
        /** Il server risponde con 200 */
        (res) => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss({ message: 'Room Aggiornata' }, 'ok');
          }
          // possibili errori
          else {
            this.form.reset();
            this.modalController.dismiss({ message: res['message'] }, 'error');
          }
        },
        /** Il server risponde con un errore */
        (err) => {
          this.form.reset();
          this.modalController.dismiss({ message: err.error['text'] }, 'error');
        }
      );
    // this.presentToast('Room Aggiornata', 'secondary');
  }

  constructor(
    private roomsService: RoomService,
    private fb: FormBuilder,
    private roomValidator: RoomValidator,
    private modalController: ModalController
  ) {}
}
