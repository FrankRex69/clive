import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { forkJoin, Subscription } from 'rxjs';
import { ProjectService } from 'src/app/admin/projects-tab/project.service';
import { RoomService } from 'src/app/rooms/room.service';
import { SyncInfo, SyncService } from './sync.service';

@Component({
  selector: 'app-sync-toast',
  templateUrl: './sync-toast.component.html',
  styleUrls: ['./sync-toast.component.scss'],
})
export class SyncToastComponent implements OnInit, OnDestroy {
  @ViewChild('bar', { static: true }) bar: ElementRef;

  sync: SyncInfo;
  subscription: Subscription;
  showToast: boolean = false;

  constructor(
    public syncService: SyncService,
    private loadingController: LoadingController,
    private projectService: ProjectService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.subscription = this.syncService.syncStatus$.subscribe(
      (sync: SyncInfo) => {
        this.sync = sync;
        this.showToast = true;
        /* Restart Progressbar Animation */
        // let element = document.getElementById("time-bar");
        if (
          this.sync.status === this.syncService.STATUS_IN_CORSO &&
          this.sync.check !== 0
        ) {
          this.bar.nativeElement.classList.remove('time-bar');
          this.bar.nativeElement.offsetWidth;
          this.bar.nativeElement.classList.add('time-bar');
        }
      }
    );
  }

  reloadData() {
    this.loadingController
      .create({ keyboardClose: true, message: 'Loading...' })
      .then((loadingEl) => {
        loadingEl.present();
        forkJoin({
          reqProjects: this.projectService.loadProjects(),
          // reqRooms: this.roomService.loadRooms(),
        }).subscribe(({ reqProjects /* , reqRooms */ }) => {
          this.sync = null;
          this.showToast = false;
          loadingEl.dismiss();
        });
      });
  }

  closeToast() {
    this.sync = null;
    this.showToast = false;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
