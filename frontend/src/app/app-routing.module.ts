import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard as AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'rooms',
    loadChildren: () =>
      import('./rooms/rooms.module').then((m) => m.RoomsPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'conference',
    loadChildren: () =>
      import('./conference/conference.module').then(
        (m) => m.ConferencePageModule
      ),
    // canActivate: [AuthGuard],
    canLoad: [AuthGuard],
  },
  {
    path: 'gallery/:id/:proj',
    loadChildren: () =>
      import('./gallery/gallery.module').then((m) => m.GalleryPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'backoffice',
    loadChildren: () =>
      import('./backoffice/backoffice.module').then(
        (m) => m.BackofficePageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'test-gps',
    loadChildren: () =>
      import('./test-gps/test-gps.module').then((m) => m.TestGpsPageModule),
  },
  {
    path: 'capt-photo',
    loadChildren: () =>
      import('./capt-photo/capt-photo.module').then(
        (m) => m.CaptPhotoPageModule
      ),
  },
  {
    path: 'prova',
    loadChildren: () =>
      import('./prova/prova.module').then((m) => m.ProvaPageModule),
  },
  {
    path: 'test-webrtc',
    loadChildren: () => import('./test-webrtc/test-webrtc.module').then( m => m.TestWebrtcPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
