import { TemplateRef } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

export interface ListFields {
  title: string;
  key: string;
  type: string;
  size?: number;
  orderEnabled?: boolean;
  customTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'app-generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.scss'],
})
export class GenericListComponent implements OnInit {
  @Input() inputDatas$: Observable<any[]>;
  @Input() fields: ListFields[] = [];
  @Input() mobileItem: TemplateRef<any>;

  constructor() {}

  ngOnInit() {
    // this.loadList();
  }

  // loadList() {
  //   this.obs$ = this.searchStream$.pipe(
  //     // debounceTime(200), //FIX
  //     distinctUntilChanged(),
  //     // startWith(""),
  //     switchMap((query) => {
  //       return this.filterData(query);
  //     }),
  //   );
  // }

  // abstract filterData(query): Observable<any[]>;
  // abstract doRefresh(event);
}
