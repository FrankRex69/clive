import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ProjectService } from 'src/app/admin/projects-tab/project.service';
import { GenericProjectItemComponent } from 'src/app/admin/projects-tab/generic-project-item.component';
import { SyncService } from 'src/app/shared/sync-toast/sync.service';

@Component({
  selector: 'app-projects-table-item',
  templateUrl: './projects-table-item.component.html',
  styleUrls: ['../../../shared/generic-table/generic-table.component.scss'],
})
export class ProjectsTableItemComponent extends GenericProjectItemComponent {
  @Input() columns;

  constructor(
    public router: Router,
    public projectService: ProjectService,
    public authService: AuthService,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public syncService: SyncService
  ) {
    super(
      router,
      projectService,
      authService,
      alertController,
      modalController,
      toastController,
      loadingController,
      syncService
    );
  }

  ngOnInit() {}
}
