import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DropdownComponent } from './dropdown/dropdown.component';
import { GenericListComponent } from './generic-list/generic-list.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { HasRoleDirective } from './has-role.directive';
import { ObsWithStatusPipe } from './obs-with-status.pipe';
import { OrderByButtonComponent } from './order-by-button/order-by-button.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SyncToastComponent } from './sync-toast/sync-toast.component';

@NgModule({
  declarations: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent,
    GenericListComponent,
    GenericTableComponent,
    SyncToastComponent,
    SafeHtmlPipe,
    // RoomsTableItemComponent,
    // RoomsListItemComponent,
    // ProjectsTableItemComponent,
    // ProjectsListItemComponent,
    // UsersTableItemComponent,
    // UsersListItemComponent,

    // CreateProjectModalComponent,
    // EditProjectModalComponent,
    // CreateUserModalComponent,
    // EditUserModalComponent,
    // CreateRoomModalComponent,
    // EditRoomModalComponent,
  ],
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  exports: [
    HasRoleDirective,
    ObsWithStatusPipe,
    DropdownComponent,
    OrderByButtonComponent,
    GenericTableComponent,
    GenericListComponent,
    SyncToastComponent,
    SafeHtmlPipe,
    // RoomsTableItemComponent,
    // RoomsListItemComponent,
    // ProjectsTableItemComponent,
    // ProjectsListItemComponent,
    // UsersTableItemComponent,
    // UsersListItemComponent,

    // CreateProjectModalComponent,
    // EditProjectModalComponent,
    // CreateUserModalComponent,
    // EditUserModalComponent,
    // CreateRoomModalComponent,
    // EditRoomModalComponent,
  ],
  entryComponents: [
    // CreateProjectModalComponent,
    // EditProjectModalComponent,
    // CreateUserModalComponent,
    // EditUserModalComponent,
    // CreateRoomModalComponent,
    // EditRoomModalComponent,
  ],
})
export class SharedModule {}
