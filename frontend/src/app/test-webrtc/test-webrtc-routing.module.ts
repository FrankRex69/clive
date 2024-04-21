import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestWebrtcPage } from './test-webrtc.page';

const routes: Routes = [
  {
    path: '',
    component: TestWebrtcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestWebrtcPageRoutingModule {}
