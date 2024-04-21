import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ViewWillEnter } from '@ionic/angular';
import { forkJoin } from 'rxjs';

import { CommissionService } from '../admin/commission-tab/commission.service';
import { ProjectService } from '../admin/projects-tab/project.service';
import { UserService } from '../admin/users-tab/user.service';
import { AuthService } from '../auth/auth.service';
import { StorageDataService } from '../shared/storage-data.service';
import { RoomService } from './room.service';

@Component({
  selector: 'app-room',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements ViewWillEnter {
  constructor(
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public roomService: RoomService,
    public userService: UserService,
    public commissionService: CommissionService,
    public storageData: StorageDataService,
    public projectService: ProjectService,
    private loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Loading Rooms...' })
      .then((loadingEl) => {
        loadingEl.present();
        forkJoin({
          reqRooms: this.roomService.loadRooms(),
          reqProjects: this.projectService.loadProjects(),
        }).subscribe(({ reqRooms, reqProjects }) => {
          loadingEl.dismiss();
        });
      });
  }
}
