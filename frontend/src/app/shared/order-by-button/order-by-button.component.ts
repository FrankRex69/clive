import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-order-by-button',
  templateUrl: './order-by-button.component.html',
  styleUrls: ['./order-by-button.component.scss'],
})
export class OrderByButtonComponent implements OnInit {
  isCrescent = true;
  @Output() event = new EventEmitter<any>();

  orderBy() {
    this.isCrescent = !this.isCrescent;
    this.event.emit(this.isCrescent);
  }

  constructor() {}

  ngOnInit() {}
}
