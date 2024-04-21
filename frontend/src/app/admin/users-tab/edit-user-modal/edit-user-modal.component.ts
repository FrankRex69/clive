import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSelect, ModalController } from '@ionic/angular';

import {
  Commission,
  CommissionService,
} from '../../commission-tab/commission.service';
import { Authorization, User, UserService } from '../user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
})
export class EditUserModalComponent implements OnInit {
  @ViewChild('autorizzazione', { static: true }) autorizzazione: IonSelect;

  form: FormGroup = this.fb.group({
    collaudatoreufficio: [null, [Validators.required]],
    commessa: [null], // ---> La validazione viene fatta all'interno del dropdown
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
  });

  user: User;
  @Input() userId: number; // componentProp del MODALE
  selectedCommission: Commission; // valore DROPDOWN
  authorizations: Authorization[] = [];

  ngOnInit() {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe((user) => {
        this.user = user;
        // console.log(this.user.idutcas);
        this.form.patchValue({
          collaudatoreufficio: this.user.collaudatoreufficio,
          // commessa: null, // ---> il valore viene assegnato allínterno del dropdown
          username: this.user.username,
          password: this.user.password,
        });
      });
    }
    this.userService
      .getAllAuthorizations()
      .subscribe((authorizations: Authorization[]) => {
        this.authorizations = authorizations;
      });
  }

  updateUser() {
    if (!this.form.valid) {
      return;
    }
    this.userService
      .updateUser(
        this.user.id,
        this.form.value.collaudatoreufficio,
        this.form.value.username,
        this.form.value.password,
        this.autorizzazione.value,
        this.selectedCommission
          ? this.selectedCommission.id
          : this.user.idcommessa,
        this.selectedCommission
          ? this.selectedCommission.commessa
          : this.user.commessa
      )
      .subscribe(
        /** Il server risponde con 200 */
        (res) => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss(
              { message: 'Utente Aggiornato' },
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
    private userService: UserService,
    public commissionService: CommissionService
  ) {}
}
