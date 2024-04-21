import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  Project,
  ProjectService,
} from 'src/app/admin/projects-tab/project.service';
import { RoomValidator } from 'src/app/rooms/room.validator.service';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-create-room-modal',
  templateUrl: './create-room-modal.component.html',
  styleUrls: ['./create-room-modal.component.scss'],
})
export class CreateRoomModalComponent implements OnInit {
  form: FormGroup = this.fb.group({
    usermobile: [
      null,
      {
        validators: [Validators.required],
        asyncValidators: this.roomValidator.usermobileValidator(),
        updateOn: 'blur',
      },
    ],
    progetto: [null], // ---> La validazione viene fatta all'interno del dropdown
  });

  selectedProject: Project; // valore DROPDOWN

  ngOnInit() {}

  createRoom() {
    if (!this.form.valid) {
      return;
    }
    this.roomService
      .addRoom(
        this.form.value.usermobile,
        this.selectedProject.pk_proj.toString(),
        this.selectedProject.nome,
        this.selectedProject.datasincro.toString(),
        this.selectedProject.idutente,
        this.selectedProject.collaudatoreufficio,
        this.selectedProject.idcommessa,
        this.selectedProject.commessa
      )
      .subscribe(
        /** Il server risponde con 200 */
        (res) => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss({ message: 'Room Creata' }, 'ok');
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
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private roomValidator: RoomValidator,
    private roomService: RoomService,
    public projectService: ProjectService
  ) {}
}
