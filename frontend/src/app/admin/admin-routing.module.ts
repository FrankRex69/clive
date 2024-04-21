import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminPage } from './admin.page';
import { CommissionTabComponent } from './commission-tab/commission-tab.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsTabComponent } from './projects-tab/projects-tab.component';
import { UsersTabComponent } from './users-tab/users-tab.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin/tabs/dashboard', pathMatch: 'full' },
  {
    path: 'tabs',
    component: AdminPage,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'projects',
        component: ProjectsTabComponent,
      },
      {
        path: 'users',
        component: UsersTabComponent,
      },
      {
        path: 'commission',
        component: CommissionTabComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
