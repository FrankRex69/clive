import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSelect, ModalController } from '@ionic/angular';
import {
  Commission,
  CommissionService,
} from '../../commission-tab/commission.service';
import { Authorization, UserService } from '../user.service';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss'],
})
export class CreateUserModalComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    public userService: UserService,
    public commissionService: CommissionService
  ) {}

  authorizations: Authorization[] = [];

  @ViewChild('autorizzazione', { static: true }) autorizzazione: IonSelect;
  selectedCommission: Commission; // valore DROPDOWN

  form: FormGroup = this.fb.group({
    collaudatoreufficio: [null, [Validators.required]],
    commessa: [null], // ---> La validazione viene fatta all'interno del dropdown
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
  });

  ngOnInit() {
    this.userService
      .getAllAuthorizations()
      .subscribe((authorizations: Authorization[]) => {
        this.authorizations = authorizations;
      });
  }

  createUser() {
    if (!this.form.valid) {
      return;
    }
    this.userService
      .addUser(
        this.form.value.collaudatoreufficio,
        this.form.value.username,
        this.form.value.password,
        this.autorizzazione.value,
        this.selectedCommission.id,
        this.selectedCommission.commessa
      )
      .subscribe(
        /** Il server risponde con 200 */
        (res) => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss({ message: 'Utente Creato' }, 'ok');
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
}
