import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { User, UserService } from '../../users-tab/user.service';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss'],
})
export class CreateProjectModalComponent implements OnInit {
  selectedUser: User;
  form: FormGroup = this.fb.group({
    collaudatoreufficio: [null], // ---> La validazione viene fatta all'interno del dropdown
    pk_proj: [null, [Validators.required]],
    nome: [null, [Validators.required]],
    coordinate: [null, [Validators.required]],
    nodi_fisici: [null, [Validators.required]],
    nodi_ottici: [null, [Validators.required]],
    tratte: [null, [Validators.required]],
    conn_edif_opta: [null, [Validators.required]],
  });

  ngOnInit() {}

  createProject() {
    if (!this.form.valid) {
      return;
    }
    const coords = this.form.value.coordinate.replace(' ', '').split(',');
    this.projectService
      .addProject(
        this.form.value.pk_proj,
        this.form.value.nome,
        this.form.value.nodi_fisici,
        this.form.value.nodi_ottici,
        this.form.value.tratte,
        this.form.value.conn_edif_opta,
        coords[1].slice(0, 14),
        coords[0].slice(0, 14),
        this.selectedUser.id,
        this.selectedUser.collaudatoreufficio,
        this.selectedUser.idcommessa,
        this.selectedUser.commessa
      )
      .subscribe(
        /** Il server risponde con 200 */
        (res) => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss({ message: 'Progetto Creato' }, 'ok');
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
    public userService: UserService,
    private projectService: ProjectService
  ) {}
}
