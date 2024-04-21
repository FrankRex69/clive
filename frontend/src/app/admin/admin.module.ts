import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminPageRoutingModule } from './admin-routing.module';
import { AdminPage } from './admin.page';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsTabComponent } from './projects-tab/projects-tab.component';
import { UsersTabComponent } from './users-tab/users-tab.component';
import { ProjectsListItemComponent } from './projects-tab/projects-list-item/projects-list-item.component';
import { ProjectsTableItemComponent } from './projects-tab/projects-table-item/projects-table-item.component';
import { UsersTableItemComponent } from './users-tab/users-table-item/users-table-item.component';
import { UsersListItemComponent } from './users-tab/users-list-item/users-list-item.component';
import { CreateProjectModalComponent } from './projects-tab/create-project-modal/create-project-modal.component';
import { EditProjectModalComponent } from './projects-tab/edit-project-modal/edit-project-modal.component';
import { CreateUserModalComponent } from './users-tab/create-user-modal/create-user-modal.component';
import { EditUserModalComponent } from './users-tab/edit-user-modal/edit-user-modal.component';
import { CommissionListItemComponent } from './commission-tab/commission-list-item/commission-list-item.component';
import { CommissionTabComponent } from './commission-tab/commission-tab.component';
import { CommissionTableItemComponent } from './commission-tab/commission-table-item/commission-table-item.component';
import { CreateCommissionModalComponent } from './commission-tab/create-commission-modal/create-commission-modal.component';
import { EditCommissionModalComponent } from './commission-tab/edit-commission-modal/edit-commission-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    AdminPageRoutingModule,
  ],
  declarations: [
    AdminPage,

    ProjectsTabComponent,
    ProjectsTableItemComponent,
    ProjectsListItemComponent,
    CreateProjectModalComponent,
    EditProjectModalComponent,

    UsersTabComponent,
    UsersTableItemComponent,
    UsersListItemComponent,
    CreateUserModalComponent,
    EditUserModalComponent,

    CommissionTabComponent,
    CommissionTableItemComponent,
    CommissionListItemComponent,
    CreateCommissionModalComponent,
    EditCommissionModalComponent,

    DashboardComponent,
  ],
  entryComponents: [
    CreateProjectModalComponent,
    EditProjectModalComponent,
    CreateUserModalComponent,
    EditUserModalComponent,
    CreateCommissionModalComponent,
    EditCommissionModalComponent,
  ],
})
export class AdminPageModule {}
