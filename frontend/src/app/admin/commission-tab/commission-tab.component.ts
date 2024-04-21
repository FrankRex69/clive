import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { TableColumns } from 'src/app/shared/generic-table/generic-table.component';
import { Commission, CommissionService } from './commission.service';
import { GenericCommissionItemComponent } from './generic-commission-item.component';

@Component({
  selector: 'app-commission-tab',
  templateUrl: './commission-tab.component.html',
  styleUrls: ['./commission-tab.component.scss'],
})
export class CommissionTabComponent
  extends GenericCommissionItemComponent
  implements OnInit
{
  searchStream$ = new BehaviorSubject('');
  commissions$: Observable<Commission[]>;

  columns: TableColumns[] = [];

  ngOnInit() {
    this.columns = [
      { title: 'ID', key: 'id', type: 'number', size: 4, orderEnabled: true },
      {
        title: 'Commessa',
        key: 'commessa',
        type: 'string',
        size: 4,
        orderEnabled: true,
      },
      {
        title: 'Azioni',
        key: '',
        type: 'buttons',
        size: 4,
        orderEnabled: false,
      },
    ];

    this.commissions$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      startWith(''),
      switchMap((query) => {
        return this.commissionService.getCommissionsByFilter(query);
      })
    );
  }

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
