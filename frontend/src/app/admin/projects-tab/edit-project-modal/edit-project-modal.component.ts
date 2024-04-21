import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User, UserService } from '../../users-tab/user.service';
import { Project, ProjectService } from '../project.service';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.scss'],
})
export class EditProjectModalComponent implements OnInit {
  selectedUser: User;
  form: FormGroup = this.fb.group({
    collaudatoreufficio: [null], // ---> La validazione viene fatta all'interno del dropdown
    nome: [null, [Validators.required]],
    coordinate: [null, [Validators.required]],
  });

  @Input() projectId: number;
  project: Project;

  ngOnInit() {
    if (this.projectId) {
      this.projectService.getProject(this.projectId).subscribe((project) => {
        this.project = project;
        this.form.patchValue({
          // collaudatoreufficio: this.project.collaudatoreufficio, // ---> il valore viene assegnato allínterno del dropdown
          nome: this.project.nome,
          coordinate: `${this.project.lat_centro_map}, ${this.project.long_centro_map}`,
        });
      });
    }
  }

  updateProject() {
    console.log(this.form.valid);

    if (!this.form.valid) {
      return;
    }
    const coords = this.form.value.coordinate.replace(' ', '').split(',');
    this.projectService
      .updateProject(
        this.project.idprogetto,
        this.project.pk_proj,
        this.form.value.nome,
        coords[1].slice(0, 14),
        coords[0].slice(0, 14),
        this.selectedUser ? this.selectedUser.id : this.project.idutente,
        this.selectedUser
          ? this.selectedUser.collaudatoreufficio
          : this.project.collaudatoreufficio,
        this.selectedUser
          ? this.selectedUser.idcommessa
          : this.project.idcommessa,
        this.selectedUser ? this.selectedUser.commessa : this.project.commessa
      )
      .subscribe(
        /** Il server risponde con 200 */
        (res) => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss(
              { message: 'Progetto Aggiornato' },
              'ok'
            );
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
