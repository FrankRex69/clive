import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CommissionService } from '../commission.service';

@Component({
  selector: 'app-create-commission-modal',
  templateUrl: './create-commission-modal.component.html',
  styleUrls: ['./create-commission-modal.component.scss'],
})
export class CreateCommissionModalComponent implements OnInit {
  form: FormGroup = this.fb.group({
    commessa: [null, [Validators.required]],
  });

  ngOnInit() {}

  createCommission() {
    if (!this.form.valid) {
      return;
    }
    this.commissionService.addCommission(this.form.value.commessa).subscribe(
      /** Il server risponde con 200 */
      (res) => {
        // non ci sono errori
        if (res['affectedRows'] === 1) {
          this.form.reset();
          this.modalController.dismiss({ message: 'Commessa Creata' }, 'ok');
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
