import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { User, UserService } from 'src/app/admin/users-tab/user.service';
import { environment } from 'src/environments/environment';
import { SyncService } from 'src/app/shared/sync-toast/sync.service';

// export interface Log {
//   pk_proj: string;
//   message: string;
//   date: Date;
// }

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  environment = environment;

  selectedUser: User;
  form: FormGroup = this.fb.group({
    collaudatoreufficio: [null], // ---> La validazione viene fatta all'interno del dropdown
    pk_proj: [null, [Validators.required]],
  });

  // logs: Log[] = [];

  ngOnInit() {}

  syncProject() {
    console.log('ID Collaudatore: ', this.selectedUser.id);
    console.log('PK Project: ', this.form.value.pk_proj);

    if (!this.form.valid) {
      return;
    }
    if (this.syncService.sync) {
      this.presentToast('Altra sincronizzazione in corso!', 'danger');
    } else {
      this.syncService
        .requestSync(
          this.selectedUser.id.toString(),
          this.form.value.pk_proj.toString()
        )
        .subscribe(
          (res) => {
            console.log('this.syncService.requestSync => res: ', res);
            // STATUS_ERRORE_RICHIESTA --> res = false
            // STATUS_COMPLETATA --> res = true
          },
          (err) => {
            console.log('this.syncService.requestSync => err: ', err);
          },
          () => {
            // STATUS_ERRORE_RICHIESTA --> complete
            // STATUS_ERRORE_TIMEOUT --> complete
            // STATUS_COMPLETATA --> complete
            console.log('this.syncService.requestSync => complete');
          }
        );
    }
  }

  searching: boolean = false;
  errorMessage: string;

  ricercaComune(comune: string) {
    this.searching = true;
    this.errorMessage = '';
    this.http
      .get(`https://www.gerriquez.com/comuni/ws.php?dencomune=${comune}`)
      .subscribe((res) => {
        this.searching = false;
        console.log('this.searchCoord => res', res[0]);
        if (res[0]) {
          window.open(
            'https://www.nperf.com/it/map/IT/-/230.TIM/signal/?ll=' +
              res[0]['latitude'] +
              '&lg=' +
              res[0]['longitude'] +
              '&zoom=13'
          );
        } else {
          this.errorMessage = 'Comune non trovato';
        }
      });
  }

  ricercaCoordinate(coordinate: string) {
    this.errorMessage = '';
    if (coordinate) {
      let coords = coordinate.replace(' ', '').split(',');
      window.open(
        'https://www.nperf.com/it/map/IT/-/230.TIM/signal/?ll=' +
          coords[0] +
          '&lg=' +
          coords[1] +
          '&zoom=13'
      );
    } else {
      this.errorMessage = 'Mancano le coordinate';
    }
  }

  onRiavviaStreaming() {
    this.alertController
      .create({
        header: 'Riavvio Server Streaming',
        message: 'Vuoi davvero riavviare server streaming?',
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel',
          },
          {
            text: 'Riavvia',
            handler: () => {
              this.http
                .get(`${environment.apiUrl}/vidapp/`)
                .subscribe((res) => {
                  const restarted: boolean = res['restartNMS'];
                  if (restarted) {
                    this.presentToast('Server Streaming Riavviato');
                  }
                });
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  async presentToast(message: string, color?: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color ? color : 'secondary',
      duration: duration ? duration : 2000,
      cssClass: 'custom-toast',
    });
    toast.present();
  }

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private http: HttpClient,
    public userService: UserService,
    public syncService: SyncService,
    private fb: FormBuilder
  ) {}
}
