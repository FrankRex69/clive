import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestGpsPage } from './test-gps.page';

const routes: Routes = [
  {
    path: '',
    component: TestGpsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestGpsPageRoutingModule {}
