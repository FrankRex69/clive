import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CommissionService } from '../admin/commission-tab/commission.service';
import { Project, ProjectService } from '../admin/projects-tab/project.service';
import { User, UserService } from '../admin/users-tab/user.service';
import { AuthService } from '../auth/auth.service';
import { Room, RoomService } from '../rooms/room.service';

@Injectable({
  providedIn: 'root',
})
export class StorageDataService {
  constructor(
    private loadingController: LoadingController,
    private authService: AuthService,
    private userService: UserService,
    private commissionService: CommissionService,
    private projectService: ProjectService,
    private roomService: RoomService
  ) {}

  isDataLoaded: boolean = false;

  getRooms(): Observable<Room[]> {
    return this.roomService.rooms$.pipe(
      switchMap((rooms) => {
        if (!rooms || rooms.length <= 0) {
          return this.roomService.loadRooms();
        } else {
          return of(rooms);
        }
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.userService.users$.pipe(
      switchMap((users) => {
        if (!users || users.length <= 0) {
          return this.userService.loadUsers();
        } else {
          return of(users);
        }
      })
    );
  }

  getProjects(): Observable<Project[]> {
    return this.projectService.projects$.pipe(
      switchMap((projects) => {
        if (!projects || projects.length <= 0) {
          return this.projectService.loadProjects();
        } else {
          return of(projects);
        }
      })
    );
  }

  loadData() {
    return forkJoin({
      requestUsers: this.userService.loadUsers(),
      requestCommissions: this.userService.loadUsers(),
      requestProjects: this.projectService.loadProjects(),
      requestRooms: this.roomService.loadRooms(),
    });
  }
}
