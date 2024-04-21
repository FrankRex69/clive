import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoomsPage } from './rooms.page';

const routes: Routes = [
  {
    path: '',
    component: RoomsPage,
  },
  // {
  //   path: 'gallery/:id/:proj',
  //   loadChildren: () => import('./gallery/gallery.module').then((m) => m.GalleryPageModule),
  // },
  // {
  //   path: 'conference/:roomId',
  //   loadChildren: () =>
  //     import('./conference/conference.module').then((m) => m.ConferencePageModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomsPageRoutingModule {}
