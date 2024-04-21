import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { GenericProjectItemComponent } from 'src/app/admin/projects-tab/generic-project-item.component';
import { TableColumns } from 'src/app/shared/generic-table/generic-table.component';
import {
  Project,
  ProjectService,
} from 'src/app/admin/projects-tab/project.service';
import { SyncService } from 'src/app/shared/sync-toast/sync.service';

@Component({
  selector: 'app-projects-tab',
  templateUrl: './projects-tab.component.html',
  styleUrls: ['./projects-tab.component.scss'],
})
export class ProjectsTabComponent
  extends GenericProjectItemComponent
  implements OnInit
{
  searchStream$ = new BehaviorSubject('');
  projects$: Observable<Project[]>;

  // @ViewChild('desktopButtons', { static: true }) desktopButtons: TemplateRef<any>;
  // @ViewChild('mobileOptions', { static: true }) mobileOptions: TemplateRef<any>;
  // @ViewChild('sync', { static: true }) sync: TemplateRef<any>;

  columns: TableColumns[] = [];

  ngOnInit() {
    this.columns = [
      {
        title: 'ID',
        key: 'idprogetto',
        type: 'number',
        size: 0.5,
        orderEnabled: true,
      },
      {
        title: 'DataSync',
        key: 'datasincro',
        type: 'date',
        size: 1,
        orderEnabled: true,
      },
      {
        title: 'LastSync',
        key: 'DataLastSincro',
        type: 'date',
        size: 1,
        orderEnabled: true,
      },
      {
        title: 'Sync',
        key: 'sync',
        type: 'string',
        size: 1,
        orderEnabled: true /* , customTemplate: this.sync */,
      },
      {
        title: 'PK',
        key: 'pk_proj',
        type: 'string',
        size: 1,
        orderEnabled: true,
      },
      {
        title: 'Nome Progetto',
        key: 'nome',
        type: 'string',
        size: 2,
        orderEnabled: true,
      },
      {
        title: 'Collaudatore',
        key: 'collaudatoreufficio',
        type: 'string',
        size: 2,
        orderEnabled: true,
      },
      {
        title: 'Commessa',
        key: 'commessa',
        type: 'string',
        size: 1.5,
        orderEnabled: true,
      },
      {
        title: 'Azioni',
        key: '',
        type: 'buttons',
        size: 2,
        orderEnabled: false /* , customTemplate: this.desktopButtons */,
      },
    ];

    this.projects$ = this.searchStream$.pipe(
      // debounceTime(200), //FIX
      distinctUntilChanged(),
      startWith(''),
      switchMap((query) => {
        return this.projectService.getProjectsByFilter(query);
      })
    );
  }

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
}
