import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaptPhotoPage } from './capt-photo.page';

const routes: Routes = [
  {
    path: '',
    component: CaptPhotoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaptPhotoPageRoutingModule {}
