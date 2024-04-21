import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConferencePage } from './conference.page';

const routes: Routes = [
  {
    path: ':roomId',
    component: ConferencePage,
  },
  {
    path: '',
    redirectTo: '/not-found',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConferencePageRoutingModule {}
