import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-g-maps',
  templateUrl: './g-maps.component.html',
  styleUrls: ['./g-maps.component.scss'],
})
export class GMapsComponent implements OnInit {
  @Input() lat: string;
  @Input() lon: string;
  @Input() nome: string;

  constructor() {}

  ngOnInit() {}
}
