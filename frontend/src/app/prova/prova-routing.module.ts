import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProvaPage } from './prova.page';

const routes: Routes = [
  {
    path: '',
    component: ProvaPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProvaPageRoutingModule {}
