import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { forkJoin } from 'rxjs';

import { CommissionService } from './commission-tab/commission.service';
import { ProjectService } from './projects-tab/project.service';
import { UserService } from './users-tab/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  constructor(
    private loadingController: LoadingController,
    private userService: UserService,
    public commissionService: CommissionService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Loading...' })
      .then((loadingEl) => {
        loadingEl.present();
        forkJoin({
          reqUsers: this.userService.loadUsers(),
          reqCommissions: this.commissionService.loadCommissions(),
          reqProjects: this.projectService.loadProjects(),
        }).subscribe(
          ({ reqUsers, reqCommissions, reqProjects }) => {
            // console.log(
            //   '🐱‍👤 : AdminPage : reqUsers, reqCommissions, reqProjects',
            //   reqUsers,
            //   reqCommissions,
            //   reqProjects
            // );
            loadingEl.dismiss();
          },
          (err) => {
            console.log('🐱‍👤 : AdminPage : err', err);
          }
        );
      });
  }
}
