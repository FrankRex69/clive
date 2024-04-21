import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { CommissionService } from '../commission.service';
import { GenericCommissionItemComponent } from '../generic-commission-item.component';

@Component({
  selector: 'app-commission-table-item',
  templateUrl: './commission-table-item.component.html',
  styleUrls: ['../../../shared/generic-table/generic-table.component.scss'],
})
export class CommissionTableItemComponent extends GenericCommissionItemComponent {
  @Input() columns;

  constructor(
    public router: Router,
    public commissionService: CommissionService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {
    super(
      router,
      commissionService,
      authService,
      alertController,
      modalController,
      toastController
    );
  }
}
