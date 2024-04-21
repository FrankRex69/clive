import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { Room, RoomService } from 'src/app/rooms/room.service';
import { TableColumns } from 'src/app/shared/generic-table/generic-table.component';

import { RoomFunctionsService } from './room-functions.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomsListComponent implements OnInit {
  searchStream$ = new BehaviorSubject('');
  rooms$: Observable<Room[]>;
  // @ViewChild('desktopButtons', { static: true }) desktopButtons: TemplateRef<any>;
  // @ViewChild('mobileOptions', { static: true }) mobileOptions: TemplateRef<any>;
  columns: TableColumns[] = [];

  ngOnInit() {
    this.columns = [
      { title: 'ID', key: 'id', type: 'number', size: 1, orderEnabled: true },
      {
        title: 'Creata',
        key: 'data_inserimento',
        type: 'date',
        size: 1,
        orderEnabled: true,
      },
      {
        title: 'Sync',
        key: 'data_sincronizzazione',
        type: 'date',
        size: 1,
        orderEnabled: true,
      },
      {
        title: 'Commessa',
        key: 'commessa',
        type: 'string',
        size: 1,
        orderEnabled: true,
      },
      {
        title: 'Collaudatore',
        key: 'collaudatore',
        type: 'string',
        size: 2,
        orderEnabled: true,
      },
      {
        title: 'Usermobile',
        key: 'usermobile',
        type: 'string',
        size: 2,
        orderEnabled: true,
      },
      {
        title: 'Progetto',
        key: 'progetto',
        type: 'string',
        size: 2,
        orderEnabled: true,
      },
      {
        title: 'Azioni',
        key: '',
        type: 'buttons',
        size: 2,
        orderEnabled: false,
      },
    ];

    this.rooms$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      startWith(''),
      switchMap((query) => {
        return this.roomService.getRoomsByFilter(query);
      })
    );
  }

  constructor(
    public roomFunctions: RoomFunctionsService,
    private roomService: RoomService
  ) {}
}
