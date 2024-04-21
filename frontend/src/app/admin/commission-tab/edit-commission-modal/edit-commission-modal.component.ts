import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Commission, CommissionService } from '../commission.service';

@Component({
  selector: 'app-edit-commission-modal',
  templateUrl: './edit-commission-modal.component.html',
  styleUrls: ['./edit-commission-modal.component.scss'],
})
export class EditCommissionModalComponent implements OnInit {
  form: FormGroup = this.fb.group({
    commessa: [null, [Validators.required]],
  });

  @Input() commissionId: number;
  commission: Commission;

  ngOnInit() {
    if (this.commissionId) {
      this.commissionService
        .getCommission(this.commissionId)
        .subscribe((commission) => {
          this.commission = commission;
          this.form.patchValue({
            commessa: this.commission.commessa,
          });
        });
    }
  }

  updateCommission() {
    if (!this.form.valid) {
      return;
    }
    this.commissionService
      .updateCommission(this.commission.id, this.form.value.commessa)
      .subscribe(
        /** Il server risponde con 200 */
        (res) => {
          // non ci sono errori
          if (res['affectedRows'] === 1) {
            this.form.reset();
            this.modalController.dismiss(
              { message: 'Commessa Aggiornata' },
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
    private commissionService: CommissionService
  ) {}
}
